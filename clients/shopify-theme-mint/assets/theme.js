(function(){var t=document.querySelector('.announce__timer');if(!t)return;var end=Date.parse(t.dataset.end);if(isNaN(end)){t.remove();return}
function tick(){var d=end-Date.now();if(d<=0){t.remove();clearInterval(i);return}var h=Math.floor(d/36e5),m=Math.floor(d%36e5/6e4),s=Math.floor(d%6e4/1e3);t.textContent=' \u00b7 '+h+'h '+m+'m '+s+'s left'}
var i=setInterval(tick,1000);tick()})();