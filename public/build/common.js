!function(e){function r(e){var r=document.getElementsByTagName("head")[0],n=document.createElement("script");n.type="text/javascript",n.charset="utf-8",n.src=d.p+""+e+"."+O+".hot-update.js",r.appendChild(n)}function n(e){if("undefined"==typeof XMLHttpRequest)return e(new Error("No browser support"));try{var r=new XMLHttpRequest,n=d.p+""+O+".hot-update.json";r.open("GET",n,!0),r.timeout=1e4,r.send(null)}catch(t){return e(t)}r.onreadystatechange=function(){if(4===r.readyState)if(0===r.status)e(new Error("Manifest request to "+n+" timed out."));else if(404===r.status)e();else if(200!==r.status&&304!==r.status)e(new Error("Manifest request to "+n+" failed."));else{try{var t=JSON.parse(r.responseText)}catch(o){return void e(o)}e(null,t)}}}function t(e){var r=P[e];if(!r)return d;var n=function(n){return r.hot.active?P[n]?(P[n].parents.indexOf(e)<0&&P[n].parents.push(e),r.children.indexOf(n)<0&&r.children.push(n)):g=[e]:(console.warn("[HMR] unexpected require("+n+") from disposed module "+e),g=[]),d(n)};for(var t in d)Object.prototype.hasOwnProperty.call(d,t)&&(n[t]=d[t]);return n.e=function(e,r){"ready"===x&&a("prepare"),j++,d.e(e,function(){function t(){j--,"prepare"===x&&(D[e]||s(e),0===j&&0===H&&f())}try{r.call(null,n)}finally{t()}})},n}function o(e){var r={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],active:!0,accept:function(e,n){if("undefined"==typeof e)r._selfAccepted=!0;else if("function"==typeof e)r._selfAccepted=e;else if("object"==typeof e)for(var t=0;t<e.length;t++)r._acceptedDependencies[e[t]]=n;else r._acceptedDependencies[e]=n},decline:function(e){if("undefined"==typeof e)r._selfDeclined=!0;else if("number"==typeof e)r._declinedDependencies[e]=!0;else for(var n=0;n<e.length;n++)r._declinedDependencies[e[n]]=!0},dispose:function(e){r._disposeHandlers.push(e)},addDisposeHandler:function(e){r._disposeHandlers.push(e)},removeDisposeHandler:function(e){var n=r._disposeHandlers.indexOf(e);n>=0&&r._disposeHandlers.splice(n,1)},check:c,apply:p,status:function(e){return e?void m.push(e):x},addStatusHandler:function(e){m.push(e)},removeStatusHandler:function(e){var r=m.indexOf(e);r>=0&&m.splice(r,1)},data:_[e]};return r}function a(e){x=e;for(var r=0;r<m.length;r++)m[r].call(null,e)}function i(e){var r=+e+""===e;return r?+e:e}function c(e,r){if("idle"!==x)throw new Error("check() is only allowed in idle status");"function"==typeof e?(b=!1,r=e):(b=e,r=r||function(e){if(e)throw e}),a("check"),n(function(e,n){if(e)return r(e);if(!n)return a("idle"),void r(null,null);E={},A={},D={};for(var t=0;t<n.c.length;t++)A[n.c[t]]=!0;w=n.h,a("prepare"),v=r,y={};for(var o in k)s(o);"prepare"===x&&0===j&&0===H&&f()})}function l(e,r){if(A[e]&&E[e]){E[e]=!1;for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(y[n]=r[n]);0===--H&&0===j&&f()}}function s(e){A[e]?(E[e]=!0,H++,r(e)):D[e]=!0}function f(){a("ready");var e=v;if(v=null,e)if(b)p(b,e);else{var r=[];for(var n in y)Object.prototype.hasOwnProperty.call(y,n)&&r.push(i(n));e(null,r)}}function p(r,n){function t(e){for(var r=[e],n={},t=r.slice();t.length>0;){var a=t.pop(),e=P[a];if(e&&!e.hot._selfAccepted){if(e.hot._selfDeclined)return new Error("Aborted because of self decline: "+a);if(0===a)return;for(var i=0;i<e.parents.length;i++){var c=e.parents[i],l=P[c];if(l.hot._declinedDependencies[a])return new Error("Aborted because of declined dependency: "+a+" in "+c);r.indexOf(c)>=0||(l.hot._acceptedDependencies[a]?(n[c]||(n[c]=[]),o(n[c],[a])):(delete n[c],r.push(c),t.push(c)))}}}return[r,n]}function o(e,r){for(var n=0;n<r.length;n++){var t=r[n];e.indexOf(t)<0&&e.push(t)}}if("ready"!==x)throw new Error("apply() is only allowed in ready status");"function"==typeof r?(n=r,r={}):r&&"object"==typeof r?n=n||function(e){if(e)throw e}:(r={},n=n||function(e){if(e)throw e});var c={},l=[],s={};for(var f in y)if(Object.prototype.hasOwnProperty.call(y,f)){var p=i(f),u=t(p);if(!u){if(r.ignoreUnaccepted)continue;return a("abort"),n(new Error("Aborted because "+p+" is not accepted"))}if(u instanceof Error)return a("abort"),n(u);s[p]=y[p],o(l,u[0]);for(var p in u[1])Object.prototype.hasOwnProperty.call(u[1],p)&&(c[p]||(c[p]=[]),o(c[p],u[1][p]))}for(var h=[],v=0;v<l.length;v++){var p=l[v];P[p]&&P[p].hot._selfAccepted&&h.push({module:p,errorHandler:P[p].hot._selfAccepted})}a("dispose");for(var b=l.slice();b.length>0;){var p=b.pop(),m=P[p];if(m){for(var H={},j=m.hot._disposeHandlers,D=0;D<j.length;D++){var E=j[D];E(H)}_[p]=H,m.hot.active=!1,delete P[p];for(var D=0;D<m.children.length;D++){var A=P[m.children[D]];if(A){var k=A.parents.indexOf(p);k>=0&&A.parents.splice(k,1)}}}}for(var p in c)if(Object.prototype.hasOwnProperty.call(c,p))for(var m=P[p],q=c[p],D=0;D<q.length;D++){var M=q[D],k=m.children.indexOf(M);k>=0&&m.children.splice(k,1)}a("apply"),O=w;for(var p in s)Object.prototype.hasOwnProperty.call(s,p)&&(e[p]=s[p]);var N=null;for(var p in c)if(Object.prototype.hasOwnProperty.call(c,p)){for(var m=P[p],q=c[p],S=[],v=0;v<q.length;v++){var M=q[v],E=m.hot._acceptedDependencies[M];S.indexOf(E)>=0||S.push(E)}for(var v=0;v<S.length;v++){var E=S[v];try{E(c)}catch(T){N||(N=T)}}}for(var v=0;v<h.length;v++){var C=h[v],p=C.module;g=[p];try{d(p)}catch(T){if("function"==typeof C.errorHandler)try{C.errorHandler(T)}catch(T){N||(N=T)}else N||(N=T)}}return N?(a("fail"),n(N)):(a("idle"),void n(null,l))}function d(r){if(P[r])return P[r].exports;var n=P[r]={exports:{},id:r,loaded:!1,hot:o(r),parents:g,children:[]};return e[r].call(n.exports,n,n.exports,t(r)),n.loaded=!0,n.exports}var u=window.webpackJsonp;window.webpackJsonp=function(r,n){for(var t,o,a=0,i=[];a<r.length;a++)o=r[a],k[o]&&i.push.apply(i,k[o]),k[o]=0;for(t in n)e[t]=n[t];for(u&&u(r,n);i.length;)i.shift().call(null,d);return n[0]?(P[0]=0,d(0)):void 0};var h=this.webpackHotUpdate;this.webpackHotUpdate=function(e,r){l(e,r),h&&h(e,r)};var v,y,w,b=!0,O="fbd6932064fe33bf6811",_={},g=[],m=[],x="idle",H=0,j=0,D={},E={},A={},P={},k={0:0};d.e=function(e,r){if(0===k[e])return r.call(null,d);if(void 0!==k[e])k[e].push(r);else{k[e]=[r];var n=document.getElementsByTagName("head")[0],t=document.createElement("script");t.type="text/javascript",t.charset="utf-8",t.async=!0,t.src=d.p+""+e+"."+({1:"YouYuChat"}[e]||e)+".js",n.appendChild(t)}},d.m=e,d.c=P,d.p="/build/",d.h=function(){return O}}([]);
//# sourceMappingURL=common.js.map