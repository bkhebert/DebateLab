import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swords, Loader2, ThumbsUp, ThumbsDown, Lightbulb, History, Quote, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import useAuth from "../contexts/useAuth";
import { axiosClient } from "../utils/apiClient";
import { debateTopics } from "../constants/debateTopics";

interface Turn {
  role: 'user' | 'model';
  text: string;
}

interface Moment {
  quote: string;
  explanation: string;
  betterApproach?: string;
}

interface Fallacy {
  name: string;
  quote: string;
  explanation: string;
}

interface Grade {
  overallScore: number;
  categories: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  fallacies: Fallacy[];
  bestMoment: Moment;
  weakestMoment: Moment;
  summary: string;
}

interface PastSession extends Grade {
  id: number;
  topic: string;
  stance: Stance;
  strength: number;
  createdAt: string;
}

type Stance = 'for' | 'against';
const MAX_USER_TURNS = 6;

const STRENGTH_META: Record<number, { label: string; description: string }> = {
  1: { label: "Beginner", description: "Weak reasoning, occasional obvious fallacies, easy to rebut." },
  2: { label: "Casual", description: "Reasonable arguments but no formal debate training." },
  3: { label: "Competent", description: "Coherent, direct engagement, real debate experience." },
  4: { label: "Advanced", description: "Strong rebuttals, steelmanning, exposes hidden assumptions." },
  5: { label: "Expert", description: "Elite, Socratic, philosophically rigorous - genuinely difficult." },
};

const CATEGORY_LABELS: Record<string, string> = {
  argumentStructure: "Argument Structure",
  logicalReasoning: "Logical Reasoning",
  evidence: "Evidence",
  rebuttal: "Rebuttal Quality",
  responsiveness: "Responsiveness",
  counterarguments: "Counterarguments",
  clarity: "Clarity",
  consistency: "Consistency",
  persuasiveness: "Persuasiveness",
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// A handful of ready-made topics so the user isn't staring at a blank input.
const SUGGESTED_TOPICS = debateTopics.flatMap((subject) => subject.subs.map((s) => s.sub)).sort(() => Math.random() - 0.5).slice(0, 6);

type Phase = 'setup' | 'debating' | 'grading' | 'graded';

export default function TrainingMode() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [stance, setStance] = useState<Stance>('for');
  const [strength, setStrength] = useState(3);
  const [openingArgument, setOpeningArgument] = useState("");
  const [phase, setPhase] = useState<Phase>('setup');
  const [debateId, setDebateId] = useState<string | null>(null);
  const [aiStance, setAiStance] = useState<Stance>('against');
  const [history, setHistory] = useState<Turn[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [error, setError] = useState("");
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (!user) return;
    axiosClient.get('/api/training/history').then((res) => setPastSessions(res.data)).catch((err) => {
      console.error('Failed to load training history:', err);
    });
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const describeError = (err: any, fallback: string) => {
    if (err?.response?.status === 429) {
      const retryAfter = err.response.data?.retryAfterSeconds;
      return retryAfter
        ? `You've used all 3 practice debates for today - try again in ${formatDuration(retryAfter)}.`
        : "You've used all 3 practice debates for today - come back later.";
    }
    return err?.response?.data?.error || fallback;
  };

  const startDebate = async () => {
    if (!topic.trim() || !openingArgument.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await axiosClient.post('/api/training/start', {
        topic: topic.trim(),
        stance,
        strength,
        userArgument: openingArgument.trim(),
      });
      setDebateId(res.data.debateId);
      setAiStance(res.data.aiStance);
      setHistory([{ role: 'user', text: openingArgument.trim() }, { role: 'model', text: res.data.reply }]);
      setPhase('debating');
    } catch (err) {
      console.error('Failed to start training debate:', err);
      setError(describeError(err, "Couldn't start the debate. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const sendArgument = async () => {
    if (!userInput.trim() || loading || !debateId) return;
    const argument = userInput.trim();
    const nextHistory: Turn[] = [...history, { role: 'user', text: argument }];
    setHistory(nextHistory);
    setUserInput("");
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.post('/api/training/turn', { debateId, userArgument: argument });
      setHistory([...nextHistory, { role: 'model', text: res.data.reply }]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      // The optimistic user turn still happened server-side would be wrong to assume -
      // roll it back so the transcript doesn't show an argument that was never answered.
      setHistory(history);
      setUserInput(argument);
      setError(describeError(err, "The AI didn't respond - please try again."));
    } finally {
      setLoading(false);
    }
  };

  const getGraded = async () => {
    if (!debateId || loading) return;
    setLoading(true);
    setPhase('grading');
    setError("");
    try {
      const res = await axiosClient.post('/api/training/grade', { debateId });
      setGrade(res.data);
      setPhase('graded');
      setPastSessions((prev) => [{ ...res.data, id: Date.now(), topic, stance, strength, createdAt: new Date().toISOString() }, ...prev]);
    } catch (err) {
      console.error('Failed to grade debate:', err);
      setError(describeError(err, "Couldn't grade this debate. Please try again."));
      setPhase('debating');
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setTopic("");
    setOpeningArgument("");
    setPhase('setup');
    setDebateId(null);
    setHistory([]);
    setUserInput("");
    setGrade(null);
    setError("");
  };

  if (!user) {
    return (
      <div className="px-6 max-w-2xl mx-auto text-center mt-16">
        <Swords className="mx-auto mb-4 text-primary" size={40} />
        <PageHeader title="Training Mode" subtitle="Debate an AI opponent and get graded on your debate skills." centerSubtitle />
        <p className="text-muted-foreground mb-4">Sign in to start a practice debate.</p>
        <Link to="/signIn"><Button>Sign In</Button></Link>
      </div>
    );
  }

  const userTurnCount = history.filter((turn) => turn.role === 'user').length;
  const atTurnLimit = userTurnCount >= MAX_USER_TURNS;

  return (
    <div className="px-3 sm:px-6 max-w-3xl mx-auto pb-10">
      <PageHeader title="Training Mode" subtitle="Debate an AI opponent, then get graded on your debate skills." centerSubtitle />

      {phase === 'setup' && (
        <>
          <Card className="p-4 sm:p-6">
            <label className="text-sm font-semibold text-foreground">Topic</label>
            <textarea
              className="w-full mt-2 p-2 text-sm border border-border rounded-lg bg-background text-foreground"
              placeholder="e.g. Social media does more harm than good"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTED_TOPICS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setTopic(suggestion)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <label className="text-sm font-semibold text-foreground mt-5 block">Your Position</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStance('for')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  stance === 'for' ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                For
              </button>
              <button
                onClick={() => setStance('against')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  stance === 'against' ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                Against
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">The AI will automatically argue the opposite side.</p>

            <label className="text-sm font-semibold text-foreground mt-5 block">Opponent Difficulty</label>
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setStrength(level)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    strength === level ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-foreground">{STRENGTH_META[strength].label}:</span> {STRENGTH_META[strength].description}
            </p>

            <label className="text-sm font-semibold text-foreground mt-5 block">Your Opening Argument</label>
            <textarea
              className="w-full mt-2 p-2 text-sm border border-border rounded-lg bg-background text-foreground"
              placeholder="Make your opening case..."
              value={openingArgument}
              onChange={(e) => setOpeningArgument(e.target.value)}
            />

            {error && <p className="text-sm text-destructive mt-3">{error}</p>}
            <Button className="mt-5 w-full" disabled={!topic.trim() || !openingArgument.trim() || loading} onClick={startDebate}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Start Debate"}
            </Button>
          </Card>

          {pastSessions.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <History size={15} /> {showHistory ? "Hide" : "Show"} past sessions ({pastSessions.length})
              </button>
              {showHistory && (
                <div className="mt-2 space-y-2">
                  {pastSessions.map((session) => (
                    <Card key={session.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{session.topic}</div>
                        <div className="text-xs text-muted-foreground">
                          {session.stance} · {STRENGTH_META[session.strength].label} (L{session.strength}) · {new Date(session.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary shrink-0">{session.overallScore}/100</div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {(phase === 'debating' || phase === 'grading') && (
        <div>
          <div className="text-xs text-muted-foreground mb-2 text-center space-x-2">
            <span><span className="font-semibold text-foreground">{topic}</span></span>
            <span>· You: <span className="font-semibold text-foreground capitalize">{stance}</span></span>
            <span>· AI: <span className="font-semibold text-foreground capitalize">{aiStance}</span></span>
            <span>· {STRENGTH_META[strength].label} (L{strength})</span>
          </div>
          <Card className="p-3 sm:p-4 max-h-[55vh] overflow-y-auto flex flex-col gap-3">
            {history.map((turn, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                  turn.role === 'user'
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-accent text-accent-foreground"
                }`}
              >
                {turn.text}
              </div>
            ))}
            {loading && phase === 'debating' && (
              <div className="self-start flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="animate-spin" size={14} /> Thinking...
              </div>
            )}
            <div ref={transcriptEndRef} />
          </Card>

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}

          {atTurnLimit ? (
            <p className="text-sm text-muted-foreground mt-3 text-center">You've reached the {MAX_USER_TURNS}-turn limit for this debate - end it to see your evaluation.</p>
          ) : (
            <div className="mt-3 flex gap-2">
              <textarea
                className="flex-1 p-2 text-sm border border-border rounded-lg bg-background text-foreground"
                placeholder="Make your case..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendArgument();
                  }
                }}
              />
              <Button onClick={sendArgument} disabled={!userInput.trim() || loading}>
                Submit Argument
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-3"
            disabled={userTurnCount === 0 || loading}
            onClick={getGraded}
          >
            {phase === 'grading' ? <Loader2 className="animate-spin" size={16} /> : "End Debate & Get Evaluation"}
          </Button>
        </div>
      )}

      {phase === 'graded' && grade && (
        <div>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-foreground">Your Debate Report</h2>
              <div className="text-3xl font-bold text-primary">{grade.overallScore}<span className="text-base text-muted-foreground">/100</span></div>
            </div>
            <div className="text-xs text-muted-foreground mb-4">Opponent: Level {strength} — {STRENGTH_META[strength].label}</div>
            <p className="text-sm text-muted-foreground mb-4">{grade.summary}</p>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mb-5">
              {Object.entries(grade.categories).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border p-2 text-center">
                  <div className="text-lg font-bold text-foreground">{value}<span className="text-xs text-muted-foreground">/10</span></div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{CATEGORY_LABELS[key] || key}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <ThumbsUp size={15} className="text-green-500" /> Strengths
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {grade.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <ThumbsDown size={15} className="text-destructive" /> Weaknesses
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {grade.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <Lightbulb size={15} className="text-yellow-500" /> Improve
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {grade.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            </div>

            {grade.fallacies.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                  <AlertTriangle size={15} className="text-yellow-600" /> Fallacies Detected
                </div>
                <div className="space-y-2">
                  {grade.fallacies.map((f, i) => (
                    <div key={i} className="text-sm border border-border rounded-lg p-2">
                      <div className="font-semibold text-foreground">{f.name}</div>
                      <div className="text-muted-foreground italic">"{f.quote}"</div>
                      <div className="text-muted-foreground mt-1">{f.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1">
                  <Quote size={14} className="text-green-500" /> Best Moment
                </div>
                <div className="text-sm text-muted-foreground italic">"{grade.bestMoment.quote}"</div>
                <div className="text-sm text-muted-foreground mt-1">{grade.bestMoment.explanation}</div>
              </div>
              <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1">
                  <Quote size={14} className="text-destructive" /> Weakest Moment
                </div>
                <div className="text-sm text-muted-foreground italic">"{grade.weakestMoment.quote}"</div>
                <div className="text-sm text-muted-foreground mt-1">{grade.weakestMoment.explanation}</div>
                {grade.weakestMoment.betterApproach && (
                  <div className="text-sm text-foreground mt-1"><span className="font-semibold">Better approach:</span> {grade.weakestMoment.betterApproach}</div>
                )}
              </div>
            </div>
          </Card>
          <Button className="w-full mt-4" onClick={startOver}>Debate Again</Button>
        </div>
      )}
    </div>
  );
}
