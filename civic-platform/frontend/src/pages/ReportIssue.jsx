import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reportsAPI } from '../lib/api';
import { CATEGORY_META } from '../lib/utils';

const CATEGORIES = Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, ...v }));

// Simple AI category suggestion based on keywords
function aiSuggestCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('pothole') || t.includes('hole in road') || t.includes('road crack')) return 'pothole';
  if (t.includes('water') || t.includes('pipe') || t.includes('leak') || t.includes('flood')) return 'water_leakage';
  if (t.includes('light') || t.includes('lamp') || t.includes('dark street')) return 'streetlight';
  if (t.includes('drain') || t.includes('sewage') || t.includes('overflow')) return 'drainage';
  if (t.includes('garbage') || t.includes('waste') || t.includes('trash') || t.includes('litter')) return 'garbage';
  if (t.includes('road') || t.includes('damage') || t.includes('broken road')) return 'road_damage';
  if (t.includes('encroach') || t.includes('illegal construction') || t.includes('blockade')) return 'encroachment';
  return null;
}

export default function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    lat: '',
    lng: '',
    address: '',
    ward: '',
    city: '',
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [listening, setListening] = useState(false);
  const [step, setStep] = useState(1); // 1=details, 2=location, 3=media, 4=review

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleDescriptionChange = (val) => {
    set('description', val);
    const suggested = aiSuggestCategory(val);
    if (suggested && suggested !== form.category) setSuggestion(suggested);
    else setSuggestion(null);
  };

  const getGPS = useCallback(() => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        set('lat', lat.toFixed(6));
        set('lng', lng.toFixed(6));

        // Reverse geocode using Nominatim (free)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          set('address', data.display_name?.split(',').slice(0, 3).join(',') || '');
          set('city', data.address?.city || data.address?.town || data.address?.state_district || '');
        } catch (_) {}

        setGpsLoading(false);
        toast.success('📍 Location detected!');
      },
      () => { setGpsLoading(false); toast.error('Could not get location'); }
    );
  }, [form.category]);

  const handleFiles = (selected) => {
    const arr = Array.from(selected).slice(0, 5);
    setFiles(arr);
    setPreviews(arr.map(f => ({ url: URL.createObjectURL(f), type: f.type })));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error('Voice input not supported in this browser');
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      set('description', form.description + ' ' + transcript);
      handleDescriptionChange(form.description + ' ' + transcript);
    };
    rec.start();
  };

  const submit = async () => {
    if (!form.title || !form.description || !form.category) return toast.error('Please fill in required fields');
    if (!form.lat || !form.lng) return toast.error('Please provide a location');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('media', f));
      const res = await reportsAPI.create(fd);
      toast.success(`🎉 Report submitted! ID: ${res.data.report.reportId}`);
      if (res.data.user?.badges?.length > (0)) {
        toast('🏅 New badge earned!', { icon: '🎖️' });
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report an Issue</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Help improve your city by reporting civic problems</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {['Details', 'Location', 'Evidence', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button onClick={() => setStep(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-green-500 text-white'
                  : step === i + 1 ? 'bg-civic-600 text-white ring-4 ring-civic-600/20'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                }`}>
                {step > i + 1 ? '✓' : i + 1}
              </button>
              <span className={`text-xs font-medium ml-1.5 ${step === i + 1 ? 'text-civic-500' : 'text-slate-400'} hidden sm:block`}>{s}</span>
              {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? 'bg-civic-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeUp">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Issue Details</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input className="input" placeholder="Brief title of the issue" value={form.title}
                  onChange={e => set('title', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Description *</span>
                  <button onClick={startVoice}
                    className={`text-xs px-3 py-1 rounded-lg transition-all ${listening ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
                    {listening ? '🔴 Listening...' : '🎤 Voice Input'}
                  </button>
                </label>
                <textarea className="input resize-none" rows={4}
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={e => handleDescriptionChange(e.target.value)} />

                {/* AI suggestion */}
                {suggestion && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-civic-50 dark:bg-civic-600/10 rounded-xl border border-civic-200 dark:border-civic-600/30">
                    <span className="text-xs font-semibold text-civic-600 dark:text-civic-400">🤖 AI Suggests:</span>
                    <button onClick={() => { set('category', suggestion); setSuggestion(null); }}
                      className="flex items-center gap-1.5 text-xs bg-civic-600 text-white px-3 py-1.5 rounded-lg hover:bg-civic-700 transition-all">
                      {CATEGORY_META[suggestion].icon} {CATEGORY_META[suggestion].label}
                      <span className="opacity-70">— Apply</span>
                    </button>
                    <button onClick={() => setSuggestion(null)} className="text-xs text-slate-400 hover:text-slate-600 ml-auto">✕</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => set('category', cat.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        form.category === cat.key
                          ? 'border-civic-500 bg-civic-50 dark:bg-civic-600/20'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}>
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!form.title || !form.description || !form.category}
                className="btn-primary w-full mt-2">Continue →</button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeUp">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Location</h2>

              <button onClick={getGPS} disabled={gpsLoading}
                className="w-full py-4 border-2 border-dashed border-civic-300 dark:border-civic-600/50 rounded-xl text-civic-600 dark:text-civic-400 font-semibold hover:bg-civic-50 dark:hover:bg-civic-600/10 transition-all flex items-center justify-center gap-2">
                {gpsLoading
                  ? <><div className="w-4 h-4 border-2 border-civic-500/30 border-t-civic-500 rounded-full animate-spin" /> Detecting location...</>
                  : <><span className="text-xl">📍</span> Auto-detect my location</>
                }
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Latitude *</label>
                  <input className="input font-mono text-sm" placeholder="e.g. 28.613900" value={form.lat}
                    onChange={e => set('lat', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Longitude *</label>
                  <input className="input font-mono text-sm" placeholder="e.g. 77.209000" value={form.lng}
                    onChange={e => set('lng', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <input className="input" placeholder="Street address" value={form.address}
                  onChange={e => set('address', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ward / Locality</label>
                  <input className="input" placeholder="Ward number or name" value={form.ward}
                    onChange={e => set('ward', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City</label>
                  <input className="input" placeholder="City name" value={form.city}
                    onChange={e => set('city', e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">← Back</button>
                <button onClick={() => setStep(3)} disabled={!form.lat || !form.lng} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeUp">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Evidence (Optional)</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add photos or videos to help authorities assess the issue faster.</p>

              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-civic-400 hover:bg-civic-50 dark:hover:bg-civic-600/5 transition-all">
                <p className="text-4xl mb-3">📷</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Drop files here or click to upload</p>
                <p className="text-sm text-slate-400 mt-1">Images or videos, up to 5 files, max 10MB each</p>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden"
                  onChange={e => handleFiles(e.target.files)} />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                      {p.type.startsWith('video') ? (
                        <video src={p.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button onClick={() => {
                        setFiles(prev => prev.filter((_, j) => j !== i));
                        setPreviews(prev => prev.filter((_, j) => j !== i));
                      }} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1">← Back</button>
                <button onClick={() => setStep(4)} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeUp">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Review & Submit</h2>

              <div className="space-y-3 bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                <Row label="Title" value={form.title} />
                <Row label="Category" value={`${CATEGORY_META[form.category]?.icon} ${CATEGORY_META[form.category]?.label}`} />
                <Row label="Location" value={`${form.lat}, ${form.lng}`} mono />
                {form.address && <Row label="Address" value={form.address} />}
                <Row label="Description" value={form.description} />
                {files.length > 0 && <Row label="Media" value={`${files.length} file(s) attached`} />}
              </div>

              <div className="p-4 bg-civic-50 dark:bg-civic-600/10 rounded-xl text-sm text-civic-700 dark:text-civic-300 border border-civic-200 dark:border-civic-600/30">
                🤖 <strong>AI will analyze</strong> your report, assign it a priority score, and route it to the appropriate department automatically.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="btn-ghost flex-1">← Back</button>
                <button onClick={submit} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading
                    ? <><div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Submitting...</>
                    : '🚀 Submit Report'
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
