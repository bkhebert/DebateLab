// RecoilSimulatorApp.jsx
// Single-file React + React-Three-Fiber demo
// - Uses fictional weapon profiles (DO NOT use for real-world ballistics or tuning)
// - Shows a 3D target plane and a red dot marking the simulated impact
// - Physics core: conservation-of-momentum recoil vector + projectile RK4 integrator
// - Aim perturbation from a simple wind/torque model (game-grade, fictional)
//
// How to use:
// 1) Create a React project (Vite/CRA/Next) with these deps:
//    - react, react-dom
//    - three
//    - @react-three/fiber
//    - @react-three/drei
//    - tailwindcss (optional; styling here uses tailwind classes but also minimal inline styles)
// 2) Drop this file into src/ and import it from your app entry (e.g. App.jsx -> <RecoilSimulatorApp />)
// 3) Run dev server. The target distance slider maps to forward distance; click "Simulate" to recompute.
//
// IMPORTANT: This project intentionally uses fictional/sample parameters. I will NOT provide or
// help tune this to replicate or improve real firearm accuracy or performance. This demo is
// intended for presentation, game, or educational use only.

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Text } from '@react-three/drei';

// -------------------- Fictional weapon profiles --------------------
const PROFILES = {
  A: {
    id: 'A', name: 'Model A (light) - FICTIONAL',
    m_g: 3.0,       // kg (fictional) gun mass
    m_b: 0.012,     // kg (fictional) bullet mass
    v0: 820,        // m/s (fictional) mezzle velocity
    Cd: 0.295,      // bullet drag coefficient
    A: 0.0005,      // cross-sectional area of the bullet
    delta_t_muzzle: 0.002,  // effective muzzle impulse time aka duration of recoil
    Cd_rifle: 1.0, // dimensionless, drag coefficient of the rifle itself
    A_rifle: 0.06,  // m², cross-sectional area of the rifle for aerodynamic drag
    I: 0.15,  // kg·m², moment of inertia of the rifle about shoulder pivot (for angular acceleration/torque calcs)
    r_cp: 0.35 // m, distance from shoulder pivot to center of pressure (lever arm for aerodynamic forces)
  },
  B: {
    id: 'B', name: 'Model B (medium) - FICTIONAL',
    m_g: 4.2, m_b: 0.010, v0: 900, Cd: 0.28, A: 0.00046, delta_t_muzzle: 0.002,
    Cd_rifle: 1.0, A_rifle: 0.07, I: 0.25, r_cp: 0.30
  },
  C: {
    id: 'C', name: 'Model C (heavy support) - FICTIONAL',
    m_g: 12.0, m_b: 0.012, v0: 820, Cd: 0.33, A: 0.0006, delta_t_muzzle: 0.0025,
    Cd_rifle: 1.1, A_rifle: 0.12, I: 0.8, r_cp: 0.40
  }
};

// -------------------- Utility vector math --------------------
// These are vector math functions used for recoil simulation and aim perturbation throughout this code
const vadd = (a,b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];  // a + b (vector addition)
const vsub = (a,b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; // a - b (vector subtraction)
const vmul = (a,s) => [a[0]*s, a[1]*s, a[2]*s]; // scalar * vector
const vdot = (a,b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];  // dot(a,b)
const vlen = a => Math.sqrt(Math.max(0, vdot(a,a))); // |a| = sqrt(a·a)
const vnorm = a => { const L = vlen(a) || 1; return [a[0]/L, a[1]/L, a[2]/L]; }; // a/|a|

// -------------------- Physics core (fictional, game-grade) --------------------


/* computeRecoil: Calculates the recoil of a gun based on its profile and the angle of the barrel.

   - Uses conservation of linear momentum: m_g * v_g + m_b * v_b = 0 (approx instantaneous impulse)
     => v_g = - (m_b / m_g) * v_b    (recoil velocity of gun)
   - Converts impulse to average force: F_avg = m_g * v_g / delta_t  or equivalently Δp/Δt
*/
function computeRecoil(profile, barrelAngleDeg) {

  // first calculates the unit vector in the firing direction of the gun using the barrel angle
  const theta = barrelAngleDeg * Math.PI/180;
  const ub_local = [Math.cos(theta), 0, Math.sin(theta)]; // forward, right, up
  // unit vector in firing direction; θ is barrel angle

  // computes the initial velocity vector of the projectile by multiplying the unit vector with the gun's velocity profile.
  const v_b0 = vmul(ub_local, profile.v0);
  // v_b0 = u_b * v0  → projectile initial velocity vector
  // (definition: v = u * |v|)

  // calculates the recoil velocity of the gun by applying the conservation of linear momentum
  const v_g_recoil = vmul(v_b0, -profile.m_b / profile.m_g);
  // Δp = m Δv  (Conservation of momentum)
  // Here: m_b v_b0 + m_g v_g = 0 → v_g = -(m_b/m_g) v_b0
  // m_b = bullet mass, m_g = gun mass, v_g = recoil velocity

  // it calculates the average recoil force by multiplying the recoil velocity with the gun mass divided by the muzzle exit time
  const F_recoil_avg = vmul(v_g_recoil, profile.m_g / profile.delta_t_muzzle);
  // F = Δp / Δt  (Impulse–momentum theorem)
  // Δp = m_g v_g_recoil; Δt = muzzle exit time
  // This yields the average recoil force over muzzle time

  return { v_b0, v_g_recoil, F_recoil_avg };
}
/* applyAimPerturbationFromWind:
   - Wind applies drag force on rifle: F_wind ≈ -0.5 * ρ * C_d * A * |V| * V  (vector)
   - Resulting torque magnitude τ = |F| * r_cp    (simple lever arm)
   - Small-angle rotation estimated from rotational dynamics: α = τ / I  (rotational accel)
   - Integrate for a short response_t to get Δangle ≈ α * response_t
   - Then apply yaw/pitch rotation to the muzzle unit vector (approximate small rotations)
Input: 
the local unit vector of the rifle's barrel (ub_local), 
the wind velocity (V_wind), the air density (rho), 
and the rifle's profile (profile).
*/
function applyAimPerturbationFromWind(ub_local, V_wind, rho, profile) {
  // Simple game-model: wind force on rifle -> torque -> small yaw/pitch
  const Vw_len = vlen(V_wind); // Wind speed magnitude calculated
  if (Vw_len < 1e-6) return { ub: ub_local, yaw:0, pitch:0 }; // if wind is weak, no perturbation
  
  // Calculate wind force on rifle using drag equation
  const F_wind_rif = vmul(V_wind, -0.5 * rho * profile.Cd_rifle * profile.A_rifle * Vw_len);
   // F_d = ½ ρ C_d A v²  (Quadratic drag force)
  // Here applied to rifle cross-section: ρ = air density, Cd_rifle = drag coeff, A_rifle = area

  // calculate torque from wind force
  const torque = Math.abs(vlen(F_wind_rif)) * profile.r_cp;
    // τ = F × r  (Torque)
  // r_cp = distance to center of pressure

  const response_t = 0.2; // seconds, fictional

  // calculate rotational acceleration from torque
  const delta_alpha = torque * response_t / profile.I; // radians
  // α = τ / I  (Rotational dynamics)
  // Integrated over response_t → Δθ ≈ α * t
  // I = rotational inertia

  const yaw_sign = (V_wind[1] >= 0) ? 1 : -1;

  // calculate yaw and pitch perturbation
  const delta_yaw = delta_alpha * (Math.abs(V_wind[1]) / Math.max(Vw_len,1)) * yaw_sign;
    // yaw perturbation ∝ side component of wind velocity

  const delta_pitch = delta_alpha * (Math.abs(V_wind[0]) / Math.max(Vw_len,1)) * Math.sign(-V_wind[0]);
   // pitch perturbation ∝ vertical component of wind velocity

  // apply small yaw/pitch rotation (approximate)
  const cosY = Math.cos(delta_yaw), sinY = Math.sin(delta_yaw);
  let x = ub_local[0], y = ub_local[1], z = ub_local[2];
  let xr = x * cosY - y * sinY;
  let yr = x * sinY + y * cosY;
  const cosP = Math.cos(delta_pitch), sinP = Math.sin(delta_pitch);
  const xr2 = xr * cosP + z * sinP;
  const zr2 = -xr * sinP + z * cosP;
  const ub_new = vnorm([xr2, yr, zr2]);
  // normalize back to unit vector (definition: u = v/|v|)

  return { ub: ub_new, yaw: delta_yaw, pitch: delta_pitch };
}

/* integrateProjectile:
   - Uses RK4 to integrate projectile motion in 3D with gravity and quadratic drag.
   - Drag model (vector): F_d = -0.5 * ρ * C_d * A * |v_rel| * v_rel  (N)
   - Acceleration of projectile: a = (F_d / m_b) + g_vector  (where g_vector = [0,0,-g])
   - RK4 steps: k1 = f(y_n), k2 = f(y_n + dt*k1/2), ... standard RK4 formula for ODE y' = f(y)
*/
function integrateProjectile(profile, v0_vec, V_wind, rho, x_target, shooterHeight=1.6) {
  // RK4 integrator in 3D, stops when x >= x_target or hits ground
  const g = 9.81; // gravity
  let r = [0, 0, shooterHeight]; // initial position
  let v = v0_vec.slice(); // initial velocity
  const dt = 0.002; // time-steps
  const maxSteps = 300000; // max cap

  function accel(v_local) {
    const vrel = vsub(v_local, V_wind);
    // relative velocity = v - v_wind

    const vrel_len = vlen(vrel);
    if (vrel_len === 0) return [0,0,-g];
    const drag = vmul(vrel, -0.5 * rho * profile.Cd * profile.A * vrel_len / profile.m_b);
     // F_d = ½ ρ C_d A v²  (Drag equation)
    // a_d = F_d / m_b  → acceleration contribution

    return vadd(drag, [0,0,-g]);
        // a = (F_drag / m_b) + g (Newton’s 2nd law)

  }

  let t = 0;
  let prev = { r: r.slice(), v: v.slice(), t };
  for (let step=0; step<maxSteps; step++) {
    if (r[0] >= x_target) return {impactPos: r.slice(), time: t, hitGround:false};
    if (r[2] <= 0) return {impactPos: r.slice(), time: t, hitGround:true};
    // RK4    (Runge-Kutta 4th order method for ODE integration)
    const k1v = accel(v);
    const k1r = v;
    const v2 = vadd(v, vmul(k1v, dt/2));
    const k2v = accel(v2);
    const k2r = v2;
    const v3 = vadd(v, vmul(k2v, dt/2));
    const k3v = accel(v3);
    const k3r = v3;
    const v4 = vadd(v, vmul(k3v, dt));
    const k4v = accel(v4);
    const k4r = v4;

    // update velocity and position
    v = vadd(v, vmul(vadd(vadd(vmul(k1v,1), vmul(k2v,2)), vadd(vmul(k3v,2), vmul(k4v,1))), dt/6));
    r = vadd(r, vmul(vadd(vadd(vmul(k1r,1), vmul(k2r,2)), vadd(vmul(k3r,2), vmul(k4r,1))), dt/6));
    t += dt;
    prev = { r: r.slice(), v: v.slice(), t };
  }
  return {impactPos: r.slice(), time: t, hitGround:false, truncated:true};
}

// -------------------- React + R3F visualization --------------------
function TargetPlane({ distance = 100, impact = null, firstPerson }) {
  // Improved visual target: colorful concentric rings (white/red/blue) with slight offsets
  // and a visible border to avoid sinking into the ground. Impact marker is larger and animated
  // (scales in via simple useFrame if you want to animate it later).
  return (
   <group rotation={[0,-1 * Math.PI / 2, 0]} position={[distance, 0, 1.6]}>
      {/* Invisible plane used for raycasting (2.5 x 2.5 m) */}
      <mesh name="TargetPlaneMesh" position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        {/* transparent material so plane is invisible but raycastable */}
        <meshBasicMaterial transparent opacity={100} />
      </mesh>
      {/* Colorful concentric rings for a recognizably colored target */}
      <mesh rotation={[0, 0, 0]} position={[0.03, 0, 0.01]}> <circleGeometry args={[1.15, 64]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
      <mesh rotation={[0, 0, 0]} position={[0.025, 0, 0.015]}> <circleGeometry args={[0.85, 64]} /> <meshStandardMaterial color="#1f8cff" /> </mesh>
      <mesh rotation={[0, 0, 0]} position={[0.02, 0, 0.02]}> <circleGeometry args={[0.55, 64]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
      <mesh rotation={[0, 0, 0]} position={[0.015, 0, 0.025]}> <circleGeometry args={[0.25, 64]} /> <meshStandardMaterial color="#ff2b2b" /> </mesh>
      <mesh rotation={[0, 0, 0]} position={[0.01, 0, 0.03]}> <circleGeometry args={[0.05, 32]} /> <meshStandardMaterial color="#111111" /> </mesh>

      {/* Impact marker - brighter, emissive and clamped to target bounds */}
      {impact && (
        (() => {
          const ix = impact[0]; const iy = impact[1]; const iz = impact[2];
          let localX = iy; // horizontal
          let localY = iz - 1.6; // vertical relative to shooter height
          if(firstPerson){
            localX = iz - 1.6;
            localY = iy;
          }
          const max = 1.4;
          const mx = Math.max(-max, Math.min(max, localX));
          const my = Math.max(-max, Math.min(max, localY));
          return (
            <mesh position={[mx, my, 0.04]} > 
              <sphereGeometry args={[0.08, 24, 16]} />
              <meshStandardMaterial color="#ff2b2b" emissive="#ff6b6b" emissiveIntensity={1.4} metalness={0.2} roughness={0.3} />
            </mesh>
          );
        })()
      )}

      {/* Small rim / frame to give the target a visible border */}
      <mesh rotation={[0, Math.PI/2, 0]} position={[0,0,0.06]}> 
        <ringGeometry args={[1.25, 1.3, 64]} />
        <meshStandardMaterial color="#001826" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function SceneHelpers({ distance, firstPerson }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 10, 8]} intensity={0.8} />

      {/* Ground plane - simple colored ground to reduce contrast with target */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0,-5,0]}> 
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#081424" metalness={0.0} roughness={1.0} />
      </mesh>

      {/* Subtle grid helper (low contrast) so it doesn't visually compete with the target */}
      <gridHelper args={[200, 40, '#082733', '#071726']} position={[0,-5,0.01]} />

      {/* Shooter marker at origin so the user knows where shots originate */}
      <group position={[0,0,1.6]}> 
        <mesh> <sphereGeometry args={[0.06, 16, 12]} /> <meshStandardMaterial color="#f1c40f" emissive="#6b4d00" emissiveIntensity={0.8} /> </mesh>
        <mesh position={[0, -0.16, -0.02]}> <boxGeometry args={[0.4, 0.02, 0.02]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
      </group>
     {firstPerson ? null :  <OrbitControls minDistance={2} maxDistance={1200} maxPolarAngle={Math.PI/2.05} enablePan={true} />}
    </>
  );
}

function FirstPersonShooter({ profile, barrelAngle, distance, wind, rho, onShot }) {
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    if (!gl || !camera) return;

    const handleClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Ray from camera through clicked pixel
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      // Find the named plane mesh we added
      const targetPlane = scene.getObjectByName("TargetPlaneMesh");
      if (!targetPlane) return;

      const intersects = raycaster.intersectObject(targetPlane, false);
      if (!intersects || intersects.length === 0) return;

      const aimPoint = intersects[0].point.clone(); // world coords where user aimed

      // muzzle is always at world (0,0,1.6)
      const muzzle = new THREE.Vector3(0, 0, 1.6);

      // initial direction from muzzle to clicked aimPoint
      const dir = aimPoint.clone().sub(muzzle).normalize();

      // Build initial projectile velocity vector (no perturbation yet)
      let v_b0_click = [dir.x * profile.v0, dir.y * profile.v0, dir.z * profile.v0];

      // Now replicate the same steps as "simulate":
      // 1) compute recoil info (for result panel)
      const recoilInfo = computeRecoil(profile, barrelAngle);

      // 2) apply aim perturbation from wind to the *unit* muzzle vector
      // Use the unit of v_b0_click for perturbation input
      const ub_click = vnorm(v_b0_click);
      const pert = applyAimPerturbationFromWind(ub_click, [wind.x, wind.y, wind.z], rho, profile);

      // Apply perturbation to the projectile initial velocity
      const v_b0_pert = vmul(pert.ub, profile.v0);

      // 3) integrate projectile using the perturbed initial velocity
      const sim = integrateProjectile(profile, v_b0_pert, [wind.x, wind.y, wind.z], rho, distance);

      const impact = sim.impactPos;
      const lateral_m = impact[1];
      const vertical_m = impact[2] - 1.6; // relative to shooter height

      // Recoil force magnitude and direction (same as simulate)
      const F = recoilInfo.F_recoil_avg;
      const F_mag = vlen(F);
      const F_dir = vnorm(F);

      // Determine hit vs miss (2.5m square target centered at plane)
      const hitBoxHalf = 1.25;
      let note = 'MISS';
      if (sim.hitGround) {
        note = 'hit ground before reaching target';
      } else if (!sim.truncated && Math.abs(lateral_m) <= hitBoxHalf && Math.abs(vertical_m) <= hitBoxHalf) {
        note = 'HIT target';
      } else {
        note = 'MISS';
      }

      // Build full result same shape as simulate
      const out = {
        profile: profile.name,
        recoilNewton: F_mag,
        recoilDir: F_dir,
        deltaYawDeg: (pert.yaw || 0) * 180 / Math.PI,
        deltaPitchDeg: (pert.pitch || 0) * 180 / Math.PI,
        aimPoint: [aimPoint.x, aimPoint.y, aimPoint.z], // new field
        impact: {
          pos_m: impact,
          lateral_cm: vertical_m * 100,
          vertical_cm: lateral_m * 100,
          time_s: sim.time ?? "i love haptech",
          note
        }
      };

      onShot(out);
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, scene, profile, barrelAngle, distance, wind, rho, onShot]);

  return null;
}




export default function RecoilSimulatorApp() {
  const [firstPerson, setFirstPerson] = useState(false);
  const [profileId, setProfileId] = useState('A');
  const [distance, setDistance] = useState(100); // meters
  const [wind, setWind] = useState({ x:0, y:3, z:0 });
  const [rho, setRho] = useState(1.225);
  const [barrelAngle, setBarrelAngle] = useState(1.5);
  const [result, setResult] = useState(null);

  const profile = useMemo(() => PROFILES[profileId], [profileId]);

  const simulate = useCallback(() => {
    // 1) compute base recoil and muzzle vector
    const recoilInfo = computeRecoil(profile, barrelAngle);

    // 2) apply aim perturbation from wind
    const pert = applyAimPerturbationFromWind(recoilInfo.v_b0.map(v=>v/vlen(recoilInfo.v_b0)), [wind.x, wind.y, wind.z], rho, profile);
    const v_b0_pert = vmul(pert.ub, profile.v0);

    // 3) integrate projectile until target distance
    const sim = integrateProjectile(profile, v_b0_pert, [wind.x, wind.y, wind.z], rho, distance);

    // Compute lateral/vertical offsets in cm
    const impact = sim.impactPos;
    const lateral_m = impact[1];
    const vertical_m = impact[2] - 1.6; // relative to shooter aim height

    // Recoil force magnitude and direction
    const F = recoilInfo.F_recoil_avg;
    const F_mag = vlen(F);
    const F_dir = vnorm(F);

    const out = {
      profile: profile.name,
      recoilNewton: F_mag,
      recoilDir: F_dir,
      deltaYawDeg: (pert.yaw || 0) * 180/Math.PI,
      deltaPitchDeg: (pert.pitch || 0) * 180/Math.PI,
      impact: {
        pos_m: impact,
        lateral_cm: lateral_m*100,
        vertical_cm: vertical_m*100,
        time_s: sim.time,
        note: sim.hitGround ? 'hit ground before reaching target' : (sim.truncated ? 'truncated' : 'ok')
      }
    };
    setResult(out);
  }, [profile, barrelAngle, wind, rho, distance]);

  

  // UI layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#041025] to-[#071024] text-slate-100 p-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#071b2a] rounded-2xl p-4 shadow-2xl">
          <div style={{ height: '640px' }}>

          <Canvas key={`${distance}-${firstPerson}`} 
            camera={firstPerson ? 
            { rotation:[0,-1 * Math.PI / 2, 0], position: [0,0,1.6], fov:60, near:0.1, far:2000 } : 
            { position: [Math.max(4, distance*0.6), 2.5, 6], fov:50 }}
            >
            
              {/* Using key={distance} forces camera re-init when distance changes so users don't get lost. */}
              <SceneHelpers distance={distance} firstPerson={firstPerson} />
              <TargetPlane distance={distance} impact={result ? result.impact.pos_m : null} firstPerson={firstPerson} />
              {firstPerson && <FirstPersonShooter 
                profile={profile} 
                barrelAngle={barrelAngle}
                distance={distance}
                wind={wind}
                rho={rho}
                onShot={setResult}
              />}
            </Canvas>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-[#071b2a] p-4 rounded-xl">
            <h3 className="text-lg font-semibold">Simulator Controls</h3>
            <div className="mt-3 space-y-2">
              <label className="block text-sm text-slate-300">Weapon profile</label>
              <select value={profileId} onChange={(e)=>setProfileId(e.target.value)} className="w-full bg-[#031420] p-2 rounded">
                {Object.values(PROFILES).map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label className="block text-sm text-slate-300 mt-2">Target distance (m)</label>
              <input type="range" min={10} max={600} value={distance} onChange={e=>setDistance(Number(e.target.value))} />
              <div className="text-sm text-slate-300">{distance} m</div>

              {firstPerson ? 
              <label className="block text-sm text-slate-300 mt-3">Wind (m/s) — right, forward, up</label>
              : 
              <label className="block text-sm text-slate-300 mt-3">Wind (m/s) — forward, right, up</label>}
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={wind.x} onChange={e=>setWind(w=>({...w, x:Number(e.target.value)}))} className="bg-[#031420] p-2 rounded" />
                <input type="number" value={wind.y} onChange={e=>setWind(w=>({...w, y:Number(e.target.value)}))} className="bg-[#031420] p-2 rounded" />
                <input type="number" value={wind.z} onChange={e=>setWind(w=>({...w, z:Number(e.target.value)}))} className="bg-[#031420] p-2 rounded" />
              </div>

              <label className="block text-sm text-slate-300 mt-3">Air density (kg/m³)</label>
              <input type="number" step="0.001" value={rho} onChange={e=>setRho(Number(e.target.value))} className="bg-[#031420] p-2 rounded w-full" />

              <label className="block text-sm text-slate-300 mt-3">Barrel cant (deg)</label>
              <input type="number" step="0.1" value={barrelAngle} onChange={e=>setBarrelAngle(Number(e.target.value))} className="bg-[#031420] p-2 rounded w-full" />

              <div className="mt-4 flex gap-2">
                <button onClick={simulate} className="px-4 py-2 rounded bg-[#19a3ff] text-black font-semibold">Simulate</button>
                <button onClick={()=>{ setResult(null); }} className="px-4 py-2 rounded bg-[#25313a]">Reset</button>
              </div>
            </div>
          </div>

          <div className="bg-[#071b2a] p-4 rounded-xl">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="mt-2 text-sm text-slate-300" style={{ whiteSpace: 'pre-wrap' }}>
              {result ? (
                <div>
                  <strong>{result.profile}</strong>
                  <div>Recoil force (avg): {result.recoilNewton.toFixed(1)} N</div>
                  <div>Recoil direction: [{result.recoilDir.map(v=>v.toFixed(3)).join(', ')}]</div>
                  <div>Aim perturbation yaw: {result.deltaYawDeg.toFixed(3)}°</div>
                  <div>Aim perturbation pitch: {result.deltaPitchDeg.toFixed(3)}°</div>
                  <div>Impact lateral offset: {result.impact.lateral_cm.toFixed(1)} cm (right +)</div>
                  <div>Impact vertical offset: {result.impact.vertical_cm.toFixed(1)} cm (up +)</div>
                  <div>Flight time: {result.impact.time_s.toFixed(3)} s</div>
                  <div>Note: {result.impact.note}</div>
                </div>
              ) : (
                <div className="text-slate-400">No simulation run. Click <em>Simulate</em> to compute.</div>
              )}
            </div>
          </div>
              <button 
                onClick={() => setFirstPerson(fp => !fp)} 
                className="px-4 py-2 rounded bg-[#ff9f19] text-black font-semibold"
              >
                {firstPerson ? "Exit First Person" : "First Person Mode"}
              </button>
          <div className="bg-[#071b2a] p-4 rounded-xl text-xs text-slate-400">
            <strong>Disclaimer:</strong> This demo uses fictional parameters for presentation and game/educational purposes only. It is not suitable for real weapon modeling or improvements. If you plan to validate with measured data in a professional environment, do so under authorized and controlled conditions with appropriate domain experts.
          </div>
        </div>
      </div>
    </div>
  );
}
