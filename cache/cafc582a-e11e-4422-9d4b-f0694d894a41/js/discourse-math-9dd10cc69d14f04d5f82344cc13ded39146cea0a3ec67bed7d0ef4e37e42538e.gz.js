define("discourse/plugins/discourse-math/initializers/discourse-math-mathjax",["exports","discourse/lib/plugin-api","discourse-common/lib/get-url","discourse/lib/load-script"],function(t,i,s,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=!1;function c(t){var e,a,i;return e=t,r||(a=["toMathML.js","Safe.js"],e.enable_accessibility&&a.push("[a11y]/accessibility-menu.js"),i={jax:["input/TeX","input/AsciiMath","input/MathML","output/CommonHTML"],TeX:{extensions:["AMSmath.js","AMSsymbols.js","autoload-all.js"]},extensions:a,showProcessingMessages:!1,root:(0,s.getURLWithCDN)("/plugins/discourse-math/mathjax")},e.zoom_on_hover&&(i.menuSettings={zoom:"Hover"},i.MathEvents={hover:750}),window.MathJax=i,r=!0),(0,n.default)("/plugins/discourse-math/mathjax/MathJax.2.7.5.js")}function o(t,e){var a,i;t&&t.find&&(0<(i=e.enable_asciimath?t.find(".math, .asciimath"):t.find(".math")).length&&(a=t.hasClass("d-editor-preview"),c(e).then(function(){i.each(function(t,e){return function(t,e){var a,i,s,n,r,c,o=$(t);o.data("applied-mathjax")||(o.data("applied-mathjax",!0),o.hasClass("math")?(i="div"==(a="DIV"===t.tagName?"div":"span")?"block-math":"inline-math",s="math/tex".concat("div"==a?"; mode=display":""),n="math-container ".concat(i," mathjax-math"),r=$("<".concat(a,' class="').concat(n,'" style="display: none;">\n         <script type="').concat(s,'"><\/script>\n       </').concat(a,">")),(c=r.children()).text(o.text()),o.after(r)):o.hasClass("asciimath")&&(r=$('<span class="'.concat("math-container inline-math ascii-math",'" style="display: none;">\n         <script type="').concat("math/asciimath",'"><\/script>\n       </span>')),(c=r.children()).text(o.text()),o.after(r)),Ember.run.later(this,function(){window.MathJax.Hub.Queue(function(){t.parentElement&&null!==t.parentElement.offsetParent&&window.MathJax.Hub.Typeset(c[0],function(){o.remove(),r.show()})})},e?200:0))}(e,a)})})))}var e={name:"apply-math-mathjax",initialize:function(t){var e=t.lookup("site-settings:main"),a={zoom_on_hover:e.discourse_math_zoom_on_hover,enable_accessibility:e.discourse_math_enable_accessibility,enable_asciimath:e.discourse_math_enable_asciimath};e.discourse_math_enabled&&"mathjax"===e.discourse_math_provider&&(0,i.withPluginApi)("0.5",function(t){var e;e=a,t.decorateCooked(function(t){o(t,e)},{id:"mathjax"})})}};t.default=e}),define("discourse/plugins/discourse-math/initializers/discourse-math-katex",["exports","discourse/lib/plugin-api","discourse/lib/load-script"],function(t,a,i){"use strict";function s(t){var e;t&&t.find&&(0<(e=t.find(".math")).length&&(0,i.default)("/plugins/discourse-math/katex/katex.min.js").then(function(){return(0,i.default)("/plugins/discourse-math/katex/katex.min.css",{css:!0}).then(function(){return(0,i.default)("/plugins/discourse-math/katex/mhchem.min.js")})}).then(function(){e.each(function(t,e){return a=e,n=$(a),r="DIV"===a.tagName,void(n.data("applied-katex")||(n.data("applied-katex",!0),n.hasClass("math")&&(i="div"==("DIV"===a.tagName?"div":"span")?"block-math":"inline-math",s=n.text(),n.addClass("math-container ".concat(i," katex-math")).text(""),window.katex.render(s,a,{displayMode:r}))));var a,i,s,n,r})}))}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={name:"apply-math-katex",initialize:function(t){var e=t.lookup("site-settings:main");e.discourse_math_enabled&&"katex"===e.discourse_math_provider&&(0,a.withPluginApi)("0.5",function(t){t.decorateCooked(function(t){s(t)},{id:"katex"})})}};t.default=e}),define("discourse/plugins/discourse-math/lib/discourse-markdown/discourse-math",["exports"],function(t){"use strict";function l(t,e,a){return t!==e&&(a.utils.isWhiteSpace(t)||(a.utils.isMdAsciiPunct(t)||!!a.utils.isPunctChar(t)))}function a(t,e,a){var i,s=t.pos,n=t.posMax;if(e||t.src.charCodeAt(s)!==a||n<s+2)return!1;if(t.src.charCodeAt(s+1)===a)return!1;if(0<s&&!l(t.src.charCodeAt(s-1),a,t.md))return!1;for(var r=s+1;r<n;r++){if(t.src.charCodeAt(r)===a&&92!==t.src.charCodeAt(r-1)){i=r;break}}if(!i)return!1;if(i+1<=n){var c=t.src.charCodeAt(i+1);if(c&&!l(c,a,t.md))return!1}var o=t.src.slice(s+1,i),u=t.push("html_raw","",0),d=t.md.utils.escapeHtml(o),h=36===a?"'math'":"'asciimath'";return u.content="<span class=".concat(h,">").concat(d,"</span>"),t.pos=i+1,!0}function e(t,e){return a(t,e,36)}function i(t,e){return a(t,e,37)}function d(t,e,a,i){if(36===t.src.charCodeAt(e)&&(e++,36===t.src.charCodeAt(e))){for(var s=++e;s<a;s++)if(!i.utils.isSpace(t.src.charCodeAt(s)))return;return 1}}function s(t,e,a,i){if(!d(t,t.bMarks[e]+t.tShift[e],t.eMarks[e],t.md))return!1;if(i)return!0;for(var s=e,n=!1;!(a<=++s);)if(d(t,t.bMarks[s]+t.tShift[s],t.eMarks[s],t.md)){n=!0;break}var r=t.push("html_raw","",0),c=n?t.eMarks[s-1]:t.eMarks[s],o=t.src.slice(t.bMarks[e+1]+t.tShift[e+1],c),u=t.md.utils.escapeHtml(o);return r.content="<div class='math'>\n".concat(u,"\n</div>\n"),t.line=n?s+1:s,!0}Object.defineProperty(t,"__esModule",{value:!0}),t.setup=function(t){if(!t.markdownIt)return;var a;t.registerOptions(function(t,e){t.features.math=e.discourse_math_enabled,a=e.discourse_math_enable_asciimath}),t.registerPlugin(function(t){a&&t.inline.ruler.after("escape","asciimath",i),t.inline.ruler.after("escape","math",e),t.block.ruler.after("code","math",s,{alt:["paragraph","reference","blockquote","list"]})})}});
//# sourceMappingURL=https://sjc2.discourse-cdn.com/standard10/assets/plugins/discourse-math-9dd10cc69d14f04d5f82344cc13ded39146cea0a3ec67bed7d0ef4e37e42538e.js.map