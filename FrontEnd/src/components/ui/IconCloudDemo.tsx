import { IconCloud } from "./IconCloud";

const images = [
  "https://www.laphamsquarterly.org/sites/default/files/styles/tall_rectangle_custom_user_small_2x/public/images/contributor/camus_360x450.jpg?itok=I1FmfvNq&timestamp=1409685824",
  "https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jean_Paul_Sartre_1965.jpg/250px-Jean_Paul_Sartre_1965.jpg",
  "https://www.spectator.co.uk/wp-content/uploads/2023/01/watts.jpg",
  "https://upload.wikimedia.org/wikipedia/en/0/0f/Frantz_Fanon.jpg",
  "https://imsvintagephotos.com/cdn/shop/products/2295469-front_800x.jpg?v=1636786830",
  "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSe528Nmw7Yj9NpAF6_iWxp6ZK1xDzmm6bm18vH0SUuSNiBC4TPPCQCWM3OLmmCcgqy",
  "https://framerusercontent.com/images/v0qGpBya09PnpfPJjWIjCHHZRzM.png",
  "https://ethics.org.au/wp-content/uploads/2019/02/bell-hooks-768x346.jpg",
  "https://ethics.org.au/wp-content/uploads/2018/08/Ethics-Centre_Big-Thinkers-Simone-De-Bevoir-768x346.jpg",
  "https://ethics.org.au/wp-content/uploads/2018/08/Ethics-Centre_Big-Thinkers-Hannah-Arendt-png-768x346.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/71/Bertrand_Russell_smoking_in_1936.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Slavoj_%C5%BDi%C5%BEek_2015_%28closeup%29.jpg/250px-Slavoj_%C5%BDi%C5%BEek_2015_%28closeup%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ludwig_Wittgenstein_1929.jpg/250px-Ludwig_Wittgenstein_1929.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Daniel_Dennett_2.jpg/250px-Daniel_Dennett_2.jpg",
];

export function IconCloudDemo() {
  return (
    <div className="flex justify-center">
      <IconCloud images={images} />
    </div>
  );
}
