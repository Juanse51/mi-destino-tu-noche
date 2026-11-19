/* eslint-disable @next/next/no-img-element */
// BAR WEEK × CÍRCULO GASTRO — Banner de lanzamiento (prefijo CSS: bwl-)

const css = `
.bwl{
  --bwl-cream:#F6E6CF;--bwl-orange:#FCAE4C;--bwl-copper:#C87941;--bwl-dark:#151515;
  position:relative;width:100%;overflow:hidden;
  background:#151515 url('https://asobares.org/wp-content/uploads/2026/10/Fondo.jpg') center/cover no-repeat;
  color:var(--bwl-cream);font-family:'Poppins',sans-serif;line-height:1.4;
  container-type:inline-size;
}
.bwl *,.bwl *::before,.bwl *::after{box-sizing:border-box;font-family:'Poppins',sans-serif;}
.bwl p,.bwl h2{margin:0;padding:0;color:inherit;letter-spacing:normal;text-transform:none;}
.bwl img{display:block;max-width:100%;height:auto;border:0;}
.bwl a{text-decoration:none;}
.bwl::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(21,21,21,.92) 0%,rgba(21,21,21,.8) 55%,rgba(21,21,21,.6) 100%);}

.bwl-in{position:relative;z-index:1;width:100%;max-width:1600px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:48px;padding:52px clamp(24px,5vw,90px);}

.bwl-brands{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:14px;}
.bwl .bwl-logo-bw{width:clamp(190px,15vw,250px);}
.bwl-x{font-size:22px;font-weight:300;color:var(--bwl-orange);line-height:1;}
.bwl-badge{display:flex;align-items:center;justify-content:center;}
.bwl .bwl-badge img{width:clamp(130px,10vw,170px);height:auto;filter:drop-shadow(0 10px 24px rgba(0,0,0,.45));}

.bwl-info{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;}
.bwl p.bwl-kicker{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--bwl-dark);background:var(--bwl-orange);padding:7px 16px;border-radius:999px;margin-bottom:16px;}
.bwl h2.bwl-title{font-size:clamp(28px,3vw,44px);font-weight:800;line-height:1.08;color:var(--bwl-cream);margin-bottom:22px;}
.bwl h2.bwl-title span{color:var(--bwl-orange);}
.bwl-details{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;}
.bwl-d{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:16px;background:rgba(246,230,207,.07);border:1px solid rgba(246,230,207,.18);text-align:left;}
.bwl-d i{flex:0 0 38px;height:38px;border-radius:50%;background:var(--bwl-copper);display:flex;align-items:center;justify-content:center;}
.bwl-d svg{width:19px;height:19px;fill:none;stroke:var(--bwl-cream);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.bwl-d small{display:block;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--bwl-orange);line-height:1.2;}
.bwl-d b{display:block;font-size:clamp(15px,1.2vw,18px);font-weight:700;line-height:1.25;color:var(--bwl-cream);}

.bwl a.bwl-btn,.bwl a.bwl-btn:visited{
  display:inline-flex;align-items:center;gap:10px;margin-top:24px;
  background:var(--bwl-orange);color:var(--bwl-dark);
  font-size:15px;font-weight:700;line-height:1;
  padding:17px 28px;border-radius:999px;border:0;
  box-shadow:0 10px 26px rgba(252,174,76,.3);transition:transform .25s ease, background .25s ease;
}
.bwl a.bwl-btn:hover,.bwl a.bwl-btn:focus{background:var(--bwl-cream);color:var(--bwl-dark);transform:translateY(-2px);}
.bwl-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;}

.bwl-photo{flex:0 0 auto;width:clamp(190px,15vw,260px);aspect-ratio:4/5;border-radius:20px;overflow:hidden;position:relative;border:2px solid rgba(252,174,76,.55);box-shadow:0 18px 40px rgba(0,0,0,.45);transform:rotate(2deg);}
.bwl .bwl-photo img{width:100%;height:100%;max-width:none;object-fit:cover;}
.bwl-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(21,21,21,0) 55%,rgba(21,21,21,.55) 100%);}

.bwl-org{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:10px;}
.bwl-org span{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--bwl-orange);}
.bwl .bwl-org img{width:clamp(120px,9vw,150px);}

@container (max-width:1100px){
  .bwl-in{flex-wrap:wrap;gap:28px 32px;padding:40px 32px;}
  .bwl-brands{flex-direction:row;}
  .bwl-info{order:3;flex:1 1 100%;}
  .bwl-photo{order:4;flex:1 1 100%;width:100%;aspect-ratio:7/2;transform:none;}
  .bwl-org{flex-direction:row;}
}
@container (max-width:600px){
  .bwl-in{flex-direction:column;text-align:center;gap:22px;padding:34px 20px;}
  .bwl-brands{flex-direction:column;gap:12px;}
  .bwl .bwl-logo-bw{width:180px;}
  .bwl .bwl-badge img{width:130px;}
  .bwl-info{order:0;}
  .bwl-photo{order:0;flex:0 0 auto;aspect-ratio:16/10;}
  .bwl-org{flex-direction:column;}
  .bwl-details{flex-direction:column;width:100%;}
  .bwl-d{width:100%;}
}
@supports not (container-type:inline-size){
  @media (max-width:900px){
    .bwl-in{flex-direction:column;text-align:center;gap:22px;padding:34px 20px;}
    .bwl-details{flex-direction:column;width:100%;}
    .bwl-photo{width:100%;aspect-ratio:16/10;transform:none;}
  }
}
`

export default function BarWeekBanner() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bwl">
        <div className="bwl-in">
          <div className="bwl-brands">
            <a href="https://asobares.org/barweek" target="_blank" rel="noopener noreferrer">
              <img className="bwl-logo-bw" src="https://asobares.org/wp-content/uploads/2026/10/Logo.png" alt="Bar Week Bogotá 2026" />
            </a>
            <span className="bwl-x">×</span>
            <div className="bwl-badge">
              <img src="https://www.circulogastro.com/img/circulo-gastro-logo.png" alt="Círculo Gastro" />
            </div>
          </div>

          <div className="bwl-info">
            <p className="bwl-kicker">Lanzamiento</p>
            <h2 className="bwl-title">Bar Week <span>×</span> Círculo Gastro</h2>
            <div className="bwl-details">
              <div className="bwl-d">
                <i><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg></i>
                <div><small>Fecha</small><b>19 de noviembre</b></div>
              </div>
              <div className="bwl-d">
                <i><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></i>
                <div><small>Hora</small><b>7:00 pm</b></div>
              </div>
              <div className="bwl-d">
                <i><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></i>
                <div><small>Lugar</small><b>Colombia Social Club Usaquén</b></div>
              </div>
            </div>
            <a className="bwl-btn" href="https://asobares.org/barweek" target="_blank" rel="noopener noreferrer">
              Conoce Bar Week
              <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>

          <div className="bwl-photo">
            <img loading="lazy" src="https://asobares.org/wp-content/uploads/2026/10/Brindis-en-la-terraza-urbana.jpg" alt="Brindis en la terraza urbana" />
          </div>

          <div className="bwl-org">
            <span>Organiza</span>
            <a href="https://asobares.org/" target="_blank" rel="noopener noreferrer">
              <img src="https://asobares.org/wp-content/uploads/2026/05/Nuevo-logo-Asobares-Blanco-scaled.png" alt="Asobares - Asociación de Bares y Restaurantes de Colombia" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
