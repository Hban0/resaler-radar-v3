import { useMemo, useState } from 'react';

const seed = [
  { id: 1, name: 'Exemple fictif — sneakers', source: 'Vinted', target: 'eBay', buy: 45, sell: 78, fees: 9, shipping: 5, status: 'À vérifier' },
  { id: 2, name: 'Exemple fictif — manette', source: '2ememain', target: 'eBay', buy: 22, sell: 39, fees: 4, shipping: 4, status: 'À vérifier' }
];
const statuses = ['À vérifier', 'À acheter', 'Acheté', 'Vendu', 'Ignoré'];
const euro = n => new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(n || 0);
const net = x => Number(x.sell) - Number(x.buy) - Number(x.fees || 0) - Number(x.shipping || 0);
const roi = x => Number(x.buy) > 0 ? net(x) / Number(x.buy) * 100 : 0;

export default function App() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rr-v3')) || seed; } catch { return seed; }
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', source: 'G2G', target: 'Eldorado.gg', buy: '', sell: '', fees: '0', shipping: '0', status: 'À vérifier' });
  const save = next => { setItems(next); try { localStorage.setItem('rr-v3', JSON.stringify(next)); } catch {} };
  const shown = useMemo(() => items.filter(x => x.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'Tous' || x.status === filter)), [items, query, filter]);
  const potential = items.filter(x => !['Vendu', 'Ignoré'].includes(x.status)).reduce((s, x) => s + Math.max(0, net(x)), 0);
  const add = e => {
    e.preventDefault();
    if (!form.name.trim() || form.buy === '' || form.sell === '') return;
    save([{ ...form, id: Date.now(), buy: +form.buy, sell: +form.sell, fees: +form.fees || 0, shipping: +form.shipping || 0 }, ...items]);
    setOpen(false); setForm({ name: '', source: 'G2G', target: 'Eldorado.gg', buy: '', sell: '', fees: '0', shipping: '0', status: 'À vérifier' });
  };
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark">◎</span><span><strong>resaler<span>radar</span></strong><small>V3 · WORKSPACE</small></span></a>
      <div className="nav-label">ESPACE DE TRAVAIL</div>
      <a className="nav-item active" href="#dashboard">▦ &nbsp; Tableau de bord</a>
      <a className="nav-item" href="#opportunities">◎ &nbsp; Opportunités <span className="nav-count">{items.length}</span></a>
      <div className="sidebar-bottom"><span className="status-dot"></span><div><strong>Mode manuel</strong><small>Scanner non connecté</small></div></div>
    </aside>
    <main className="main-content" id="dashboard">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Vue d'ensemble</strong></div><div className="profile">Radar personnel <div className="avatar">R</div></div></header>
      <section className="welcome"><div><div className="eyebrow"><span className="pulse"></span> RESALER RADAR V3</div><h1>Repère les bonnes affaires<span>.</span></h1><p>Compare les prix, calcule les frais et identifie les marges nettes.</p></div><button className="primary-btn" onClick={() => setOpen(true)}>＋ Ajouter une opportunité</button></section>
      <section className="metrics">
        <article className="metric-card"><div className="metric-top">Opportunités suivies</div><div className="metric-value">{items.length}</div><div className="metric-foot">Annonces enregistrées</div></article>
        <article className="metric-card"><div className="metric-top">Profit potentiel</div><div className="metric-value">{euro(potential)}</div><div className="metric-foot">Après frais estimés</div></article>
        <article className="metric-card"><div className="metric-top">Au-dessus de 3 € net</div><div className="metric-value">{items.filter(x => net(x) >= 3).length}</div><div className="metric-foot">Seuil minimum ciblé</div></article>
        <article className="metric-card"><div className="metric-top">Prêtes à acheter</div><div className="metric-value">{items.filter(x => x.status === 'À acheter').length}</div><div className="metric-foot">À valider avant achat</div></article>
      </section>
      <section className="panel" id="opportunities">
        <div className="panel-heading"><div><h2>Opportunités</h2><p>Les exemples sont fictifs. Les données réelles doivent être ajoutées ou connectées.</p></div><button className="secondary-btn" onClick={() => setOpen(true)}>＋ Nouvelle</button></div>
        <div className="filters"><label className="search-box">⌕ <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un produit..." /></label><select value={filter} onChange={e => setFilter(e.target.value)}><option>Tous</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
        <div className="table-wrap"><table><thead><tr><th>PRODUIT</th><th>SOURCE → REVENTE</th><th>ACHAT</th><th>REVENTE</th><th>NET ESTIMÉ</th><th>ROI</th><th>STATUT</th><th></th></tr></thead><tbody>
        {shown.map(x => <tr key={x.id}><td><div className="product-name">{x.name}</div><div className="product-note">{net(x) >= 3 ? 'Au-dessus du seuil cible' : 'Sous le seuil de 3 € net'}</div></td><td><span className="platform">{x.source}</span><span className="route-arrow"> → </span><span className="platform">{x.target}</span></td><td className="number">{euro(x.buy)}</td><td className="number">{euro(x.sell)}</td><td className={'number profit ' + (net(x) >= 3 ? 'positive' : 'negative')}>{euro(net(x))}</td><td>{roi(x).toFixed(1)}%</td><td><select className="status-select" value={x.status} onChange={e => save(items.map(y => y.id === x.id ? { ...y, status: e.target.value } : y))}>{statuses.map(s => <option key={s}>{s}</option>)}</select></td><td><button className="icon-btn" onClick={() => save(items.filter(y => y.id !== x.id))} aria-label="Supprimer">×</button></td></tr>)}
        </tbody></table>{shown.length === 0 && <div className="empty">Aucune opportunité trouvée.</div>}</div>
        <div className="panel-footer"><span>{shown.length} opportunité(s) affichée(s)</span><span className="local-note">Sauvegardé sur cet appareil</span></div>
      </section>
      <section className="notice-card"><div className="notice-icon">⚡</div><div><strong>Scanner automatique à connecter</strong><p>G2G, Eldorado.gg et Z2U sont proposés comme sources, mais aucune récupération automatique de prix n'est active. N'achète pas sur la base des exemples fictifs.</p></div></section>
      <footer>RESALER RADAR V3 · Estimations indicatives · Vérifie les frais réels des plateformes</footer>
    </main>
    {open && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}><section className="modal" role="dialog" aria-modal="true"><div className="modal-heading"><div><div className="eyebrow">NOUVELLE ENTRÉE</div><h2>Ajouter une opportunité</h2></div><button className="icon-btn" onClick={() => setOpen(false)}>×</button></div><form onSubmit={add}>
      <label className="field full">Produit<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom de l'annonce" /></label>
      <div className="field-row"><label className="field">Source<select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>{['G2G','Eldorado.gg','Z2U','Vinted','2ememain','eBay','Autre'].map(s => <option key={s}>{s}</option>)}</select></label><label className="field">Revente<select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}>{['G2G','Eldorado.gg','Z2U','Vinted','2ememain','eBay','Autre'].map(s => <option key={s}>{s}</option>)}</select></label></div>
      <div className="field-row"><label className="field">Achat (€)<input type="number" min="0" step="0.01" required value={form.buy} onChange={e => setForm({ ...form, buy: e.target.value })} /></label><label className="field">Revente (€)<input type="number" min="0" step="0.01" required value={form.sell} onChange={e => setForm({ ...form, sell: e.target.value })} /></label></div>
      <div className="field-row"><label className="field">Frais (€)<input type="number" min="0" step="0.01" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} /></label><label className="field">Livraison (€)<input type="number" min="0" step="0.01" value={form.shipping} onChange={e => setForm({ ...form, shipping: e.target.value })} /></label></div>
      <label className="field full">Statut<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
      <div className="form-preview"><span>Bénéfice net estimé</span><strong className={(Number(form.sell || 0)-Number(form.buy || 0)-Number(form.fees || 0)-Number(form.shipping || 0)) >= 3 ? 'positive' : 'negative'}>{euro(Number(form.sell || 0)-Number(form.buy || 0)-Number(form.fees || 0)-Number(form.shipping || 0))}</strong></div>
      <button className="primary-btn submit-btn" type="submit">Enregistrer l'opportunité</button></form></section></div>}
  </div>;
}
