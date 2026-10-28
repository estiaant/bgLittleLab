"""Make a fully self-contained, file://-friendly version. No dependencies."""
from pathlib import Path
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text(encoding='utf8')
css=(root/'style.css').read_text(encoding='utf8')
data=(root/'js/resource-data.js').read_text(encoding='utf8')
game=(root/'js/game.js').read_text(encoding='utf8')
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'\n</style>')
html=html.replace('<script defer src="js/resource-data.js"></script>','<script>\n'+data+'\n</script>')
html=html.replace('<script defer src="js/game.js"></script>','')
html=html.replace('</body>','<script>\n'+game+'\n</script>\n</body>')
(root/'play-offline.html').write_text(html,encoding='utf8')
print('Built',root/'play-offline.html',len(html),'characters')
