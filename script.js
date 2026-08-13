(function(){
  "use strict";

  var STORAGE_KEY = "sigGenState_v1";

  var TEMPLATES = [
    {id:"modern", name:"Modern"},
    {id:"executive", name:"Executive"},
    {id:"minimal", name:"Minimal"},
    {id:"corporate", name:"Corporate"},
    {id:"creative", name:"Creative"},
    {id:"clean", name:"Clean"},
    {id:"professional", name:"Professional"},
    {id:"elegant", name:"Elegant"}
  ];

  var SOCIAL_DEFS = [
    {key:"linkedin", label:"LinkedIn", abbr:"in"},
    {key:"facebook", label:"Facebook", abbr:"f"},
    {key:"instagram", label:"Instagram", abbr:"ig"},
    {key:"twitter", label:"X / Twitter", abbr:"x"},
    {key:"youtube", label:"YouTube", abbr:"yt"},
    {key:"whatsapp", label:"WhatsApp", abbr:"wa"},
    {key:"tiktok", label:"TikTok", abbr:"tt"},
    {key:"website", label:"Website", abbr:"w"}
  ];

  var FAQS = [
    ["What is an HTML email signature?","An HTML email signature is a formatted block of contact information, added automatically to the end of your emails, that can include styled text, a logo, and clickable social links."],
    ["Is the Email Signature Generator free?","Yes. Every template, customization option, and export option on this site is completely free, with no account, subscription, or watermark."],
    ["Can I add my company logo?","Yes. Upload a PNG, JPG or WEBP logo and it will appear in your signature, processed entirely in your browser."],
    ["Can I add social media links?","Yes. Add LinkedIn, Facebook, Instagram, X, YouTube, WhatsApp, TikTok or your website, and only the links you fill in will appear."],
    ["Can I use the signature in Gmail?","Yes. Copy the signature and paste it into Gmail's signature settings, or copy the HTML if your workflow needs raw code."],
    ["Can I use it in Outlook?","Yes. The generated HTML uses table-based, inline-styled markup designed to render consistently in Outlook and Microsoft 365."],
    ["Can I use it on mobile?","Yes. The builder works on phones and tablets, and the signature itself is sized to display well on mobile email clients too."],
    ["Do I need to create an account?","No. There is no login, no email verification, and no payment required at any step."]
  ];

  var state = {
    template: "modern",
    name:"", title:"", company:"", email:"", phone:"", mobile:"", website:"", address:"",
    logo: null,
    socials: {},
    font: "Arial, Helvetica, sans-serif",
    fontSize: "13",
    primary: "#F97316",
    textColor: "#1C1917",
    logoPos: "left",
    divider: "line",
    spacing: "normal",
    align: "left",
    photoShape: "circle"
  };
  SOCIAL_DEFS.forEach(function(s){ state.socials[s.key] = {enabled:false, url:""}; });

  function loadState(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        var saved = JSON.parse(raw);
        Object.keys(saved).forEach(function(k){
          if(k === "socials"){
            Object.keys(saved.socials || {}).forEach(function(sk){
              if(state.socials[sk]) state.socials[sk] = saved.socials[sk];
            });
          } else {
            state[k] = saved[k];
          }
        });
      }
    }catch(e){ /* ignore corrupted storage */ }
  }
  function saveState(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  }

  function esc(str){
    return String(str || "").replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function isValidEmail(v){ return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isValidUrl(v){ return !v || /^https?:\/\/.+\..+/.test(v); }

  /* ---------- Real brand-colored social icons (inline SVG, base64) ---------- */
  var ICON_SVGS = {
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#1877F2"/><path d="M27 24h4l1-5h-5v-3c0-1.4.4-2.4 2.4-2.4H32V9.2C31.6 9.1 30 9 28.2 9 24.4 9 21.8 11.3 21.8 15.6V19H18v5h3.8v14h5.2V24z" fill="#fff"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="ig" x1="0" y1="48" x2="48" y2="0"><stop offset="0" stop-color="#FEE411"/><stop offset=".3" stop-color="#FD5949"/><stop offset=".6" stop-color="#D6249F"/><stop offset="1" stop-color="#285AEB"/></linearGradient></defs><circle cx="24" cy="24" r="24" fill="url(#ig)"/><rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="24" cy="24" r="5.2" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="30.5" cy="17.5" r="1.6" fill="#fff"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#000"/><path d="M13 13l9.2 12.3L13 35h3l7.6-8.3L30 35h5l-9.6-12.9L34 13h-3l-6.9 7.6L18 13h-5z" fill="#fff"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0A66C2"/><rect x="12" y="20" width="5" height="16" fill="#fff"/><circle cx="14.5" cy="14" r="3" fill="#fff"/><path d="M22 20h5v2.3c1-1.7 2.9-2.8 5.3-2.8 4.2 0 6.7 2.7 6.7 7.6V36h-5v-8c0-2.2-.8-3.7-2.9-3.7-1.6 0-2.6 1.1-3 2.1-.2.4-.2.9-.2 1.5V36h-5V20z" fill="#fff"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#FF0000"/><path d="M20 17l12 7-12 7z" fill="#fff"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#25D366"/><path d="M24 12c-6.6 0-12 5.4-12 12 0 2.2.6 4.2 1.6 6L12 36l6.2-1.6c1.7 1 3.7 1.6 5.8 1.6 6.6 0 12-5.4 12-12s-5.4-12-12-12zm6.4 16.9c-.3.8-1.5 1.5-2.4 1.6-.6.1-1.4.2-4.3-.9-3.6-1.4-6-5.1-6.1-5.4-.2-.2-1.4-1.9-1.4-3.6s.9-2.6 1.2-2.9c.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .8.6.3.7 1.1 2.4 1.2 2.6.1.2.2.4 0 .7-.1.2-.2.4-.4.6-.2.2-.4.5-.6.6-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.1.8-.1.2-.2 1-.9 1.2-1.3.2-.3.5-.3.8-.2.3.1 2 1 2.4 1.1.4.2.6.3.7.5.1.1.1.7-.2 1.5z" fill="#fff"/></svg>',
    tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#000"/><path d="M29.5 9.5c.7 3.6 3 6 6.9 6.3v4.5c-2.4.1-4.6-.6-6.6-2v9.9c0 5.3-4.3 9.6-9.6 9.6-2.6 0-4.9-1-6.6-2.7-1.8-1.8-2.8-4.3-2.6-7 .3-4.7 4.4-8.6 9.2-8.6.4 0 .8 0 1.2.1v4.6c-.4-.1-.8-.2-1.2-.2-2.4 0-4.4 1.9-4.6 4.3-.1 1.3.3 2.4 1.1 3.4.8.9 2 1.5 3.3 1.5 2.4 0 4.5-1.9 4.6-4.3V9.5h4.9z" fill="#fff"/></svg>'
  };
  function websiteIconSvg(color){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="'+color+'"/><circle cx="24" cy="24" r="13" fill="none" stroke="#fff" stroke-width="2.2"/><line x1="11" y1="24" x2="37" y2="24" stroke="#fff" stroke-width="2.2"/><path d="M24 11c4 4 4 18 0 26M24 11c-4 4-4 18 0 26" fill="none" stroke="#fff" stroke-width="2.2"/></svg>';
  }

  /* ---------- SVG -> PNG conversion (email clients, esp. Gmail mobile, mangle inline SVG data-URIs;
     PNG data-URIs render reliably everywhere) ---------- */
  var ICON_PNG_CACHE = {};
  var ICON_PENDING = {};
  var iconRefreshTimer = null;
  function svgToPngDataUri(svgMarkup, sizePx){
    return new Promise(function(resolve){
      try{
        var svgUri = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgMarkup)));
        var img = new Image();
        img.onload = function(){
          try{
            var canvas = document.createElement("canvas");
            canvas.width = sizePx;
            canvas.height = sizePx;
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, sizePx, sizePx);
            ctx.drawImage(img, 0, 0, sizePx, sizePx);
            resolve(canvas.toDataURL("image/png"));
          }catch(e){ resolve(svgUri); }
        };
        img.onerror = function(){ resolve(svgUri); };
        img.src = svgUri;
      }catch(e){ resolve(""); }
    });
  }
  function scheduleIconRefresh(){
    clearTimeout(iconRefreshTimer);
    iconRefreshTimer = setTimeout(function(){ renderPreview(); }, 120);
  }
  function queueIconGeneration(cacheKey, svg, sizePx){
    if(ICON_PENDING[cacheKey]) return;
    ICON_PENDING[cacheKey] = true;
    svgToPngDataUri(svg, sizePx).then(function(pngUri){
      ICON_PNG_CACHE[cacheKey] = pngUri;
      delete ICON_PENDING[cacheKey];
      scheduleIconRefresh();
    });
  }
  function iconDataUri(key){
    var svg = key === "website" ? websiteIconSvg(state.primary) : ICON_SVGS[key];
    if(!svg) return "";
    var cacheKey = key === "website" ? "social_website_" + state.primary : "social_" + key;
    if(ICON_PNG_CACHE[cacheKey]) return ICON_PNG_CACHE[cacheKey];
    queueIconGeneration(cacheKey, svg, 88);
    try{
      return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    }catch(e){ return ""; }
  }

  /* ---------- Build UI: template cards ---------- */
  var tplGrid = document.getElementById("tplGrid");
  TEMPLATES.forEach(function(t){
    var card = document.createElement("div");
    card.className = "tpl-card";
    card.setAttribute("role","button");
    card.setAttribute("tabindex","0");
    card.dataset.tpl = t.id;
    card.innerHTML =
      '<div class="tpl-thumb"><div class="tpl-thumb-scale" id="thumb-'+t.id+'"></div></div>' +
      '<div class="tpl-card-info"><div class="tpl-name">'+t.name+'</div><span class="tpl-live-badge">Your signature</span><div class="tpl-select">Select ›</div></div>';
    card.addEventListener("click", function(){ selectTemplate(t.id); });
    card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); card.click(); } });
    tplGrid.appendChild(card);
  });
  function refreshTplActive(){
    Array.prototype.forEach.call(tplGrid.children, function(c){
      c.classList.toggle("active", c.dataset.tpl === state.template);
    });
  }
  function selectTemplate(id){
    state.template = id;
    refreshTplActive();
    saveState();
    renderPreview();
    var chrome = document.querySelector(".email-chrome");
    if(chrome){
      chrome.scrollIntoView({behavior:"smooth", block:"center"});
      chrome.classList.remove("pulse-highlight");
      void chrome.offsetWidth;
      chrome.classList.add("pulse-highlight");
    }
  }

  /* ---------- Build UI: social rows ---------- */
  var socialList = document.getElementById("socialList");
  SOCIAL_DEFS.forEach(function(s){
    var row = document.createElement("div");
    row.className = "social-row";
    row.innerHTML =
      '<button type="button" class="social-toggle" data-key="'+s.key+'" aria-pressed="false" title="Enable '+s.label+'">'+s.abbr+'</button>' +
      '<input type="url" placeholder="'+s.label+' URL" data-key="'+s.key+'" aria-label="'+s.label+' URL">';
    socialList.appendChild(row);
  });

  /* ---------- Field wiring ---------- */
  var fields = ["name","title","company","email","phone","mobile","website","address"];
  fields.forEach(function(f){
    var el = document.getElementById("in-"+f);
    el.addEventListener("input", function(){
      state[f] = el.value;
      validateField(f);
      saveState();
      renderPreview();
    });
  });

  function validateField(f){
    if(f === "name"){
      var wrap = document.getElementById("f-name");
      wrap.classList.toggle("err", !state.name.trim());
    }
    if(f === "email"){
      var w2 = document.getElementById("f-email");
      w2.classList.toggle("err", !isValidEmail(state.email));
    }
    if(f === "website"){
      var w3 = document.getElementById("f-website");
      w3.classList.toggle("err", !isValidUrl(state.website));
    }
  }

  Array.prototype.forEach.call(socialList.querySelectorAll(".social-toggle"), function(btn){
    btn.addEventListener("click", function(){
      var key = btn.dataset.key;
      state.socials[key].enabled = !state.socials[key].enabled;
      btn.classList.toggle("on", state.socials[key].enabled);
      btn.setAttribute("aria-pressed", String(state.socials[key].enabled));
      saveState();
      renderPreview();
    });
  });
  Array.prototype.forEach.call(socialList.querySelectorAll("input"), function(inp){
    inp.addEventListener("input", function(){
      var key = inp.dataset.key;
      state.socials[key].url = inp.value;
      if(inp.value && !state.socials[key].enabled){
        state.socials[key].enabled = true;
        var btn = socialList.querySelector('.social-toggle[data-key="'+key+'"]');
        btn.classList.add("on");
        btn.setAttribute("aria-pressed","true");
      }
      saveState();
      renderPreview();
    });
  });

  /* ---------- Logo upload ---------- */
  var logoDrop = document.getElementById("logoDrop");
  var logoInput = document.getElementById("logoInput");
  var logoPreview = document.getElementById("logoPreview");
  var logoImg = document.getElementById("logoImg");
  logoDrop.addEventListener("click", function(){ logoInput.click(); });
  logoInput.addEventListener("change", function(){
    var file = logoInput.files && logoInput.files[0];
    if(!file) return;
    var okTypes = ["image/png","image/jpeg","image/webp"];
    if(okTypes.indexOf(file.type) === -1){
      showToast("Unsupported image format. Please use PNG, JPG or WEBP.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(){
      state.logo = reader.result;
      logoImg.src = state.logo;
      logoPreview.style.display = "flex";
      logoDrop.style.display = "none";
      saveState();
      renderPreview();
    };
    reader.onerror = function(){ showToast("We couldn't read that logo file. Please try another."); };
    reader.readAsDataURL(file);
  });
  document.getElementById("logoRemove").addEventListener("click", function(){
    state.logo = null;
    logoInput.value = "";
    logoPreview.style.display = "none";
    logoDrop.style.display = "block";
    saveState();
    renderPreview();
  });

  /* ---------- Section accordions ---------- */
  function wireAccordion(toggleId, bodyId, arrowId){
    var toggle = document.getElementById(toggleId);
    var body = document.getElementById(bodyId);
    var arrow = document.getElementById(arrowId);
    toggle.addEventListener("click", function(){
      var open = body.classList.toggle("open");
      arrow.classList.toggle("open", open);
    });
  }
  wireAccordion("infoToggle", "infoBody", "infoArrow");
  wireAccordion("photoToggle", "photoBody", "photoArrow");
  wireAccordion("socialToggle", "socialBody", "socialArrow");
  var custToggle = document.getElementById("custToggle");
  var custBody = document.getElementById("custBody");
  var custArrow = document.getElementById("custArrow");
  custToggle.addEventListener("click", function(){
    var open = custBody.classList.toggle("open");
    custArrow.classList.toggle("open", open);
  });

  var custMap = {
    "in-font":"font", "in-fontsize":"fontSize", "in-primary":"primary",
    "in-textcolor":"textColor", "in-logopos":"logoPos", "in-divider":"divider",
    "in-spacing":"spacing", "in-align":"align", "in-photoshape":"photoShape"
  };
  Object.keys(custMap).forEach(function(id){
    var el = document.getElementById(id);
    el.addEventListener("input", function(){
      state[custMap[id]] = el.value;
      saveState();
      renderPreview();
    });
  });

  /* ---------- Signature HTML generation (email-safe, table-based) ---------- */
  function spacingPx(){
    return state.spacing === "compact" ? 4 : state.spacing === "roomy" ? 12 : 7;
  }
  function socialIconsRow(){
    var active = SOCIAL_DEFS.filter(function(s){ return state.socials[s.key].enabled && state.socials[s.key].url; });
    if(!active.length) return "";
    var cells = active.map(function(s){
      var rawUrl = state.socials[s.key].url;
      var href = s.key === "whatsapp"
        ? "https://wa.me/" + esc(rawUrl.replace(/[^\d]/g,""))
        : esc(rawUrl);
      var icon = iconDataUri(s.key);
      return '<td style="padding:0 6px 0 0;">' +
        '<a href="'+href+'" target="_blank" style="text-decoration:none;display:inline-block;">' +
        '<img src="'+icon+'" width="22" height="22" alt="'+esc(s.label)+'" style="width:22px;height:22px;border-radius:50%;display:block;">' +
        '</a></td>';
    }).join("");
    return '<tr><td style="padding-top:'+spacingPx()+'px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'+cells+'</tr></table></td></tr>';
  }
  /* ---------- Real outline icons for contact rows (phone, mobile, email, website, address) ---------- */
  function contactIconSvg(type, color){
    switch(type){
      case "phone":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="'+color+'"/></svg>';
      case "mobile":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.2" fill="none" stroke="'+color+'" stroke-width="1.8"/><circle cx="12" cy="18" r="1.1" fill="'+color+'"/></svg>';
      case "email":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2.2" fill="none" stroke="'+color+'" stroke-width="1.8"/><path d="M3 6l9 7 9-7" fill="none" stroke="'+color+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case "website":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="'+color+'" stroke-width="1.8"/><line x1="3" y1="12" x2="21" y2="12" stroke="'+color+'" stroke-width="1.8"/><path d="M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18" fill="none" stroke="'+color+'" stroke-width="1.8"/></svg>';
      case "address":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill="none" stroke="'+color+'" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.3" fill="'+color+'"/></svg>';
      default: return "";
    }
  }
  function contactIconUri(type, color){
    var svg = contactIconSvg(type, color);
    if(!svg) return "";
    var cacheKey = "contact_" + type + "_" + color;
    if(ICON_PNG_CACHE[cacheKey]) return ICON_PNG_CACHE[cacheKey];
    queueIconGeneration(cacheKey, svg, 64);
    try{ return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg))); }catch(e){ return ""; }
  }
  function contactRow(type, label, value, href, o){
    if(!value) return "";
    o = o || {};
    var color = o.color || state.primary;
    var v = esc(value);
    var defaultLinkColor = (type === "email" || type === "website") ? state.primary : (o.textColor || state.textColor);
    var inner = href ? '<a href="'+esc(href)+'" style="color:'+(o.linkColor || defaultLinkColor)+';text-decoration:none;">'+v+'</a>' : v;
    var iconImg = '<img src="'+contactIconUri(type, color)+'" width="'+(o.iconSize||14)+'" height="'+(o.iconSize||14)+'" style="vertical-align:middle;margin-right:7px;display:inline-block;">';
    var labelHtml = o.showLabel === false ? '' : '<span style="font-weight:bold;color:'+(o.labelColor || o.textColor || state.textColor)+';">'+esc(label)+':</span> ';
    return '<tr><td style="padding-top:'+(o.gap != null ? o.gap : Math.max(3, spacingPx()-2))+'px;font-family:'+state.font+';font-size:'+state.fontSize+'px;color:'+(o.textColor || state.textColor)+';">'+
      iconImg + labelHtml + inner + '</td></tr>';
  }
  function contactRows(o){
    o = o || {};
    var L = o.labels || {};
    var rows = "";
    if(!o.skipPhone) rows += contactRow("phone", L.phone || "Phone", state.phone, state.phone ? "tel:"+state.phone.replace(/\s+/g,"") : "", o);
    if(!o.skipMobile) rows += contactRow("mobile", L.mobile || "Mobile", state.mobile, state.mobile ? "tel:"+state.mobile.replace(/\s+/g,"") : "", o);
    rows += contactRow("email", L.email || "Email", state.email, state.email ? "mailto:"+state.email : "", o);
    rows += contactRow("website", L.website || "Website", state.website, state.website || "", o);
    if(!o.skipAddress) rows += contactRow("address", L.address || "Address", state.address, "", o);
    return rows;
  }
  function photoRadius(){
    return state.photoShape === "square" ? "6px" : state.photoShape === "rounded" ? "16px" : "50%";
  }
  function rawPhotoImg(size){
    if(!state.logo) return "";
    return '<img src="'+state.logo+'" width="'+size+'" alt="'+esc(state.name || state.company || "Photo")+'" style="width:'+size+'px;height:'+size+'px;object-fit:cover;border-radius:'+photoRadius()+';display:block;">';
  }
  function logoCell(size){
    var img = rawPhotoImg(size);
    if(!img) return "";
    return '<td valign="top" style="padding-right:16px;">'+img+'</td>';
  }
  function wrapDoc(inner){
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:'+state.font+';">'+
      '<tr><td>'+inner+'</td></tr></table>';
  }

  function nameBlock(opts){
    opts = opts || {};
    return '<div style="font-family:'+(opts.font||state.font)+';font-size:'+(parseInt(state.fontSize,10)+(opts.nameBump!=null?opts.nameBump:3))+'px;font-weight:'+(opts.nameWeight||'bold')+';color:'+(opts.nameColor||state.textColor)+';'+(opts.nameCaps?'text-transform:uppercase;letter-spacing:0.5px;':'')+'">'+esc(state.name || "Your Name")+'</div>' +
      (state.title ? '<div style="font-family:'+(opts.font||state.font)+';font-size:'+state.fontSize+'px;color:'+(opts.titleColor||state.primary)+';font-weight:'+(opts.titleWeight||'bold')+';margin-top:3px;'+(opts.titleCaps?'text-transform:uppercase;letter-spacing:1px;':'')+'">'+esc(state.title)+'</div>' : '') +
      (state.company ? '<div style="font-family:'+(opts.font||state.font)+';font-size:'+state.fontSize+'px;color:'+(opts.companyColor||state.textColor)+';margin-top:1px;">'+esc(state.company)+'</div>' : '');
  }

  var TEMPLATE_BUILDERS = {
    /* Circular photo, colored vertical divider, serif name, small caps title, "Best regards" lead-in */
    modern: function(){
      var photoImg = rawPhotoImg(state.logo ? 100 : 92);
      var dividerStyle = state.divider !== "none" ? 'border-right:2px solid '+state.primary+';' : '';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>' +
        (photoImg ? '<td style="padding-right:15px;'+dividerStyle+'vertical-align:middle;">'+photoImg+'</td>' : '') +
        '<td style="padding-left:'+(photoImg?15:0)+'px;vertical-align:middle;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:'+(parseInt(state.fontSize,10)+6)+'px;font-weight:bold;color:'+state.primary+';padding-bottom:2px;font-family:'+state.font+';">'+esc(state.name || "Your Name")+'</td></tr>' +
        (state.title ? '<tr><td style="font-size:'+state.fontSize+'px;color:'+state.textColor+';padding-bottom:6px;font-family:'+state.font+';">'+esc(state.title)+(state.company?' · '+esc(state.company):'')+'</td></tr>' : '') +
        contactRows({skipMobile:true, textColor:"#555555", labelColor:"#555555"}) +
        socialIconsRow() +
        '</table></td></tr></table>';
      return wrapDoc(main);
    },
    /* Photo with name/title stacked underneath, red divider, contact block on the right */
    executive: function(){
      var photoImg = rawPhotoImg(76);
      var vDiv = state.divider !== "none" ? '<td style="width:2px;background:'+state.primary+';padding:0;"></td>' : '';
      var leftCell = '<td valign="top" style="padding-right:16px;">' +
        (photoImg || "") +
        '<div style="margin-top:8px;">' + nameBlock({nameBump:1, nameColor:state.primary}) + '</div>' +
        '</td>';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        leftCell + vDiv +
        '<td valign="top" style="padding-left:16px;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0">' + contactRows() + socialIconsRow() + '</table>' +
        '</td></tr></table>';
      return wrapDoc(main);
    },
    /* Thin light-weight name, lowercase bold labels, generous spacing */
    minimal: function(){
      var photoImg = rawPhotoImg(88);
      var vDiv = state.divider !== "none" ? '<td style="width:1px;background:#E2DED8;padding:0;"></td>' : '';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        (photoImg ? '<td valign="middle" style="padding-right:20px;">'+photoImg+'</td>' : '') +
        vDiv +
        '<td valign="middle" style="padding-left:20px;">' +
        nameBlock({nameWeight:"normal", nameBump:5, titleWeight:"normal", titleColor:"#7A756C"}) +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">' +
        contactRows({labels:{phone:"phone",mobile:"mobile",email:"email",website:"website",address:"address"}, labelColor:"#7A756C"}) +
        socialIconsRow() +
        '</table></td></tr></table>';
      return wrapDoc(main);
    },
    /* Light card, teal labels, small circular photo, socials up top */
    corporate: function(){
      var photoImg = rawPhotoImg(58);
      var social = socialIconsRow();
      var head = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
        '<td valign="middle">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        (photoImg ? '<td style="padding-right:12px;">'+photoImg+'</td>' : '') +
        '<td valign="middle">' + nameBlock({nameColor:state.primary}) + '</td>' +
        '</tr></table></td>' +
        (social ? '<td valign="top" align="right"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' + social.replace(/^<tr>|<\/tr>$/g,"").replace(/<td/g,'<td valign="top"') + '</tr></table></td>' : '') +
        '</tr></table>';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#F7F5F1;border-radius:12px;"><tr><td style="padding:18px;">' +
        head +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">' +
        contactRows({labelColor:state.primary}) +
        '</table>' +
        '</td></tr></table>';
      return wrapDoc(main);
    },
    /* Circular photo on a soft backdrop, colon-style icon rows, no bold labels */
    creative: function(){
      var photoImg = rawPhotoImg(70);
      var photoTd = photoImg ? '<td valign="top" style="padding:8px;background:#F5F0E9;border-radius:18px;">'+photoImg+'</td>' : "";
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        photoTd +
        (photoTd ? '<td style="width:18px;"></td>' : '') +
        '<td valign="top">' +
        nameBlock({nameColor:state.primary, titleColor:"#6B655B", titleWeight:"normal"}) +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:'+spacingPx()+'px;">' +
        contactRows({showLabel:false, skipPhone:true, skipMobile:true}) +
        socialIconsRow() +
        '</table></td></tr></table>';
      return wrapDoc(main);
    },
    /* All-caps serif name, bullet-separated contact line, circular socials, confidentiality note */
    clean: function(){
      var photoImg = rawPhotoImg(88);
      var parts = [];
      if(state.phone) parts.push('<a href="tel:'+esc(state.phone.replace(/\s+/g,""))+'" style="color:'+state.textColor+';text-decoration:none;">'+esc(state.phone)+'</a>');
      if(state.website) parts.push('<a href="'+esc(state.website)+'" style="color:'+state.textColor+';text-decoration:none;">'+esc(state.website)+'</a>');
      if(state.email) parts.push('<a href="mailto:'+esc(state.email)+'" style="color:'+state.textColor+';text-decoration:none;">'+esc(state.email)+'</a>');
      var bulletLine = parts.length ? '<div style="font-family:'+state.font+';font-size:'+state.fontSize+'px;color:'+state.textColor+';margin-top:6px;">' +
        parts.join('&nbsp;&nbsp;<span style="color:'+state.primary+';">&#9679;</span>&nbsp;&nbsp;') + '</div>' : '';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        (photoImg ? '<td valign="top" style="padding-right:18px;">'+photoImg+'</td>' : '') +
        '<td valign="top">' +
        nameBlock({font:"Georgia, 'Times New Roman', serif", nameBump:2, nameColor:state.primary, nameCaps:true, titleCaps:true}) +
        bulletLine +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">' + socialIconsRow() + '</table>' +
        '<div style="margin-top:14px;padding-top:12px;border-top:1px solid #E2DED8;font-family:'+state.font+';font-size:11px;color:#9A9186;font-style:italic;line-height:1.5;max-width:420px;">' +
        'This email and any attachments are confidential and intended solely for the addressee.</div>' +
        '</td></tr></table>';
      return wrapDoc(main);
    },
    /* Two-tone card: photo/name up top, solid colored contact band below with company name */
    professional: function(){
      var photoImg = rawPhotoImg(84);
      var topRow = '<tr>' +
        (photoImg ? '<td style="padding-right:16px;" valign="middle">'+photoImg+'</td>' : '') +
        '<td valign="middle">' +
        nameBlock({nameBump:5}) +
        (state.phone ? '<div style="font-family:'+state.font+';font-size:'+state.fontSize+'px;color:'+state.textColor+';margin-top:6px;">Call: <a href="tel:'+esc(state.phone.replace(/\s+/g,""))+'" style="color:'+state.textColor+';text-decoration:none;">'+esc(state.phone)+'</a></div>' : '') +
        '</td></tr>';
      var bandInner = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
        '<td valign="middle" style="font-family:'+state.font+';font-size:'+state.fontSize+'px;color:#ffffff;line-height:1.6;">' +
        (state.address ? esc(state.address)+'<br>' : '') +
        (state.email ? 'E-mail: '+esc(state.email) : '') +
        '</td>' +
        '<td valign="middle" align="right" style="font-family:'+state.font+';font-size:'+(parseInt(state.fontSize,10)+3)+'px;color:#ffffff;font-weight:bold;white-space:nowrap;">' +
        esc(state.company || "") +
        '</td></tr></table>';
      var social = socialIconsRow();
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E2DED8;border-radius:12px;"><tr><td style="padding:18px 18px 14px;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">' + topRow + '</table>' +
        '</td></tr>' +
        '<tr><td style="background:'+state.primary+';padding:14px 18px;'+(state.address||state.email||state.company ? '' : 'display:none;')+'">' + bandInner + '</td></tr>' +
        (social ? '<tr><td style="padding:12px 18px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0">'+social+'</table></td></tr>' : '') +
        '</table>';
      return wrapDoc(main);
    },
    /* Dark navy card, white text, colored icons and links */
    elegant: function(){
      var photoImg = rawPhotoImg(76);
      var inner = '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        (photoImg ? '<td valign="top" style="padding-right:16px;">'+photoImg+'</td>' : '') +
        '<td valign="top">' +
        '<div style="font-family:Georgia, \'Times New Roman\', serif;font-size:'+(parseInt(state.fontSize,10)+6)+'px;color:#ffffff;">'+esc(state.name||"Your Name")+'</div>' +
        (state.title ? '<div style="font-family:'+state.font+';font-size:'+state.fontSize+'px;color:'+state.primary+';margin-top:3px;">'+esc(state.title)+'</div>' : '') +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">' +
        contactRows({textColor:"#D7D2C8", labelColor:"#D7D2C8"}) + socialIconsRow() +
        '</table></td></tr></table>';
      var main = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#1B2733;border-radius:14px;"><tr><td style="padding:22px;">'+inner+'</td></tr></table>';
      return wrapDoc(main);
    }
  };

  function buildSignatureHtml(){
    var builder = TEMPLATE_BUILDERS[state.template] || TEMPLATE_BUILDERS.modern;
    return builder();
  }

  function fullHtmlDocument(sigHtml){
    return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Email Signature</title>\n</head>\n<body style="margin:0;padding:0;background:#ffffff;">\n' + sigHtml + '\n</body>\n</html>';
  }

  /* ---------- Template gallery: fixed demo previews (independent of the user's own info) ---------- */
  var DEMO_PROFILES = {
    modern: {name:"Sarah Chen", title:"Marketing Director", company:"Bloom Agency", email:"sarah@bloomagency.com", phone:"(415) 555-0142", website:"https://bloomagency.com", address:"", socials:["linkedin","instagram","facebook"], gender:"f", skin:"#E8B48C", hair:"#3B2313", bg:"#FDEBDD", clothing:"#2D5F8A"},
    executive: {name:"James Whitfield", title:"Chief Financial Officer", company:"Whitfield Capital", email:"j.whitfield@whitfieldcapital.com", phone:"(212) 555-0199", website:"https://whitfieldcapital.com", address:"", socials:["linkedin","twitter"], gender:"m", skin:"#C68B59", hair:"#171310", bg:"#E7EEF8", clothing:"#1F2937"},
    minimal: {name:"Priya Nair", title:"UX Researcher", company:"Loop Studio", email:"priya@loopstudio.io", phone:"+91 98765 43210", website:"https://loopstudio.io", address:"", socials:["linkedin","website"], gender:"f", skin:"#A66A3E", hair:"#100D0A", bg:"#EAF3EC", clothing:"#4B5F5A"},
    corporate: {name:"Michael Osei", title:"Operations Manager", company:"Vertex Logistics", email:"m.osei@vertexlogistics.com", phone:"(312) 555-0170", website:"https://vertexlogistics.com", address:"400 Corporate Dr, Chicago, IL", socials:["linkedin","facebook","youtube"], gender:"m", skin:"#7A4A26", hair:"#0D0A08", bg:"#FBE9EC", clothing:"#7A1F2B"},
    creative: {name:"Luna Torres", title:"Art Director", company:"Studio Ember", email:"luna@studioember.com", phone:"(646) 555-0133", website:"https://studioember.com", address:"", socials:["instagram","tiktok","youtube"], gender:"f", skin:"#D9A066", hair:"#4A2A12", bg:"#F3E8FA", clothing:"#7C3AED"},
    clean: {name:"David Kim", title:"Software Engineer", company:"Northline Tech", email:"david.kim@northline.tech", phone:"(206) 555-0188", website:"https://northline.tech", address:"", socials:["linkedin","website"], gender:"m", skin:"#E8C39E", hair:"#1B1710", bg:"#E7F5F5", clothing:"#0F766E"},
    professional: {name:"Amara Okafor", title:"Legal Counsel", company:"Okafor & Partners", email:"amara@okaforlaw.com", phone:"(713) 555-0121", website:"https://okaforlaw.com", address:"", socials:["linkedin"], gender:"f", skin:"#5C3A21", hair:"#0D0D0D", bg:"#F7F1E3", clothing:"#92400E"},
    elegant: {name:"Henry Whitmore", title:"Creative Consultant", company:"Whitmore & Co.", email:"henry@whitmoreco.com", phone:"+44 20 7946 0958", website:"https://whitmoreco.com", address:"", socials:["linkedin","instagram"], gender:"m", skin:"#F0C8A0", hair:"#6B4423", bg:"#EFEAF6", clothing:"#3F3F46"}
  };
  function avatarIllustrationSvg(o){
    var shoulders = '<path d="M10 100 C10 66 28 56 50 56 C72 56 90 66 90 100 Z" fill="'+o.clothing+'"/>';
    var neck = '<rect x="41" y="46" width="18" height="16" fill="'+o.skin+'"/>';
    var head = '<circle cx="50" cy="38" r="20" fill="'+o.skin+'"/>';
    var hair = o.gender === "f"
      ? '<path d="M28 30 C28 10 72 10 72 30 L74 52 C74 39 64 33 60 39 C60 23 40 23 40 39 C36 33 26 39 26 52 Z" fill="'+o.hair+'"/>'
      : '<path d="M30 28 C30 11 70 11 70 28 L70 37 C60 22 40 22 30 37 Z" fill="'+o.hair+'"/>';
    var collar = o.gender === "f"
      ? '<path d="M40 62 L50 73 L60 62" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M42 58 L50 71 L58 58 M46 58 L50 67 L54 58" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<circle cx="50" cy="50" r="50" fill="'+o.bg+'"/>' + shoulders + neck + head + hair + collar + '</svg>';
  }
  function demoAvatarDataUri(profile){
    var svg = avatarIllustrationSvg(profile);
    try{ return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg))); }catch(e){ return ""; }
  }

  function demoSignatureHtml(tplId){
    var profile = DEMO_PROFILES[tplId] || DEMO_PROFILES.modern;
    var savedFields = {};
    ["name","title","company","email","phone","mobile","website","address","logo"].forEach(function(k){ savedFields[k] = state[k]; });
    var savedSocials = JSON.parse(JSON.stringify(state.socials));

    state.name = profile.name;
    state.title = profile.title;
    state.company = profile.company;
    state.email = profile.email;
    state.phone = profile.phone;
    state.mobile = "";
    state.website = profile.website;
    state.address = profile.address;
    state.logo = demoAvatarDataUri(profile);
    SOCIAL_DEFS.forEach(function(s){
      state.socials[s.key] = {enabled: profile.socials.indexOf(s.key) !== -1, url: profile.socials.indexOf(s.key) !== -1 ? "https://example.com" : ""};
    });

    var builder = TEMPLATE_BUILDERS[tplId] || TEMPLATE_BUILDERS.modern;
    var html;
    try{ html = builder(); }catch(e){ html = ""; }

    Object.keys(savedFields).forEach(function(k){ state[k] = savedFields[k]; });
    state.socials = savedSocials;
    return html;
  }

  function scaleThumb(el){
    if(!el) return;
    var box = el.parentElement;
    if(!box) return;
    el.style.transform = "translateY(-50%) scale(1)";
    var contentW = el.scrollWidth || 1;
    var contentH = el.scrollHeight || 1;
    var boxW = box.clientWidth - 20;
    var boxH = box.clientHeight - 16;
    var scale = Math.min(boxW / contentW, boxH / contentH, 0.62);
    if(!isFinite(scale) || scale <= 0) scale = 0.28;
    el.style.transform = "translateY(-50%) scale(" + scale + ")";
  }

  function renderTemplateThumbs(){
    TEMPLATES.forEach(function(t){
      var el = document.getElementById("thumb-" + t.id);
      if(!el) return;
      el.innerHTML = (t.id === state.template) ? buildSignatureHtml() : demoSignatureHtml(t.id);
      scaleThumb(el);
    });
  }

  /* ---------- Preview rendering ---------- */
  var previewFrame = document.getElementById("previewFrame");
  function renderPreview(){
    var sig = buildSignatureHtml();
    var doc = '<html><head><meta charset="UTF-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;background:#ffffff;}</style></head><body>' + sig + '</body></html>';
    previewFrame.srcdoc = doc;
    resizeFrame();
    renderTemplateThumbs();
  }
  function resizeFrame(){
    setTimeout(function(){
      try{
        var doc = previewFrame.contentDocument;
        if(doc && doc.body){
          previewFrame.style.height = Math.max(180, doc.body.scrollHeight + 32) + "px";
        }
      }catch(e){}
    }, 60);
  }
  previewFrame.addEventListener("load", resizeFrame);
  var resizeThumbTimer;
  window.addEventListener("resize", function(){
    clearTimeout(resizeThumbTimer);
    resizeThumbTimer = setTimeout(function(){
      TEMPLATES.forEach(function(t){ scaleThumb(document.getElementById("thumb-" + t.id)); });
    }, 150);
  });

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- Actions ---------- */
  function doCopyHtml(){
    if(!state.name.trim()){ showToast("Add your full name before copying."); document.getElementById("in-name").focus(); return; }
    var html = fullHtmlDocument(buildSignatureHtml());
    copyText(html, "HTML signature copied successfully!");
  }
  function doCopySignature(){
    if(!state.name.trim()){ showToast("Add your full name before copying."); document.getElementById("in-name").focus(); return; }
    try{
      var doc = previewFrame.contentDocument;
      var range = doc.createRange();
      range.selectNodeContents(doc.body);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      var ok = doc.execCommand && doc.execCommand("copy");
      sel.removeAllRanges();
      if(ok){ showToast("Signature copied — paste it into your email client!"); }
      else { copyText(buildSignatureHtml(), "Signature HTML copied!"); }
    }catch(e){
      copyText(buildSignatureHtml(), "Signature HTML copied!");
    }
  }
  function copyText(text, successMsg){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        showToast(successMsg);
      }).catch(function(){
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }
  function fallbackCopy(text, successMsg){
    try{
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(successMsg);
    }catch(e){
      showToast("Copy failed — please select and copy manually.");
    }
  }
  function doDownload(){
    if(!state.name.trim()){ showToast("Add your full name before downloading."); document.getElementById("in-name").focus(); return; }
    try{
      var html = fullHtmlDocument(buildSignatureHtml());
      var blob = new Blob([html], {type:"text/html"});
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "email-signature.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
      showToast("Signature downloaded!");
    }catch(e){
      showToast("Download failed. Please try again.");
    }
  }

  document.getElementById("btnCopyHtml").addEventListener("click", doCopyHtml);
  document.getElementById("btnCopySig").addEventListener("click", doCopySignature);
  document.getElementById("btnDownload").addEventListener("click", doDownload);
  document.getElementById("btnCopyHtmlM").addEventListener("click", doCopyHtml);
  document.getElementById("btnCopySigM").addEventListener("click", doCopySignature);
  document.getElementById("btnDownloadM").addEventListener("click", doDownload);

  /* ---------- FAQ ---------- */
  var faqList = document.getElementById("faqList");
  FAQS.forEach(function(pair){
    var item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = '<button class="faq-q" type="button">'+pair[0]+'<span class="arrow">▾</span></button>' +
      '<div class="faq-a">'+pair[1]+'</div>';
    var btn = item.querySelector(".faq-q");
    var body = item.querySelector(".faq-a");
    var arrow = item.querySelector(".arrow");
    btn.addEventListener("click", function(){
      var open = body.classList.toggle("open");
      arrow.classList.toggle("open", open);
    });
    faqList.appendChild(item);
  });

  /* ---------- Mobile menu ---------- */
  document.querySelector(".menu-toggle").addEventListener("click", function(){
    var links = document.querySelector("nav.links");
    var isOpen = links.style.display === "flex";
    links.style.display = isOpen ? "none" : "flex";
    links.style.flexDirection = "column";
    links.style.position = "absolute";
    links.style.top = "64px";
    links.style.right = "24px";
    links.style.background = "#fff";
    links.style.border = "1px solid var(--line)";
    links.style.borderRadius = "12px";
    links.style.padding = "14px 20px";
    links.style.boxShadow = "0 20px 40px -20px rgba(0,0,0,.3)";
  });

  /* ---------- Init from saved state ---------- */
  function applyStateToForm(){
    fields.forEach(function(f){ document.getElementById("in-"+f).value = state[f] || ""; });
    document.getElementById("in-font").value = state.font;
    document.getElementById("in-fontsize").value = state.fontSize;
    document.getElementById("in-primary").value = state.primary;
    document.getElementById("in-textcolor").value = state.textColor;
    document.getElementById("in-logopos").value = state.logoPos;
    document.getElementById("in-divider").value = state.divider;
    document.getElementById("in-spacing").value = state.spacing;
    document.getElementById("in-align").value = state.align;
    document.getElementById("in-photoshape").value = state.photoShape;
    SOCIAL_DEFS.forEach(function(s){
      var inp = socialList.querySelector('input[data-key="'+s.key+'"]');
      var btn = socialList.querySelector('.social-toggle[data-key="'+s.key+'"]');
      inp.value = state.socials[s.key].url || "";
      btn.classList.toggle("on", !!state.socials[s.key].enabled);
      btn.setAttribute("aria-pressed", String(!!state.socials[s.key].enabled));
    });
    if(state.logo){
      logoImg.src = state.logo;
      logoPreview.style.display = "flex";
      logoDrop.style.display = "none";
    }
    refreshTplActive();
  }

  loadState();
  applyStateToForm();
  renderPreview();
})();
