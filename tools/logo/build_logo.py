"""Build logo.svg (full lockup) + mark.svg (symbol only) from fitted geometry."""
import sys, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
cfg = json.load(open(sys.argv[1]))
NAVY, RED, GREEN = '#2c3157', '#ed3541', '#5abc63'
f = TTFont('/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf')
gs, cmap, upm, hm = f.getGlyphSet(), f.getBestCmap(), f['head'].unitsPerEm, f['hmtx']
def text(l):
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    x, s = l['x'], l['fs'] / upm
    for ch in l['t']:
        g = cmap[ord(ch)]
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, l['base'])))
        x += hm[g][0] * s
    return pen.getCommands()
m, ec = cfg['mark'], cfg['ec']
defs, body = '', ''
for k, col in (('red', RED), ('navy', NAVY), ('green', GREEN)):
    o, i = m[k]['o'], m[k]['i']
    defs += f'<mask id="ec-{k}"><circle cx="{o[0]}" cy="{o[1]}" r="{o[2]}" fill="#fff"/><circle cx="{i[0]}" cy="{i[1]}" r="{i[2]}"/></mask>'
    body += f'<circle mask="url(#ec-{k})" cx="{o[0]}" cy="{o[1]}" r="{o[2]}" fill="{col}"/>'
body += f'<polygon points="{ec["hept"]}" fill="#fff" stroke="{RED}" stroke-width="2"/>'
body += f'<g fill="#fff" stroke="{RED}" stroke-width="1.6"><polygon points="{ec["E"]}"/><polygon points="{ec["Cc"]}"/></g>'
A = m['atom']; cx, cy = A['c']
body += f'<g fill="none" stroke-width="{A["sw"]}">' + ''.join(
    f'<ellipse cx="{cx}" cy="{cy}" rx="{e["rx"]}" ry="{e["ry"]}" transform="rotate({e["rot"]} {cx} {cy})" stroke="{e["col"]}"/>' for e in A['ell']) + '</g>'
body += ''.join(f'<circle cx="{d[0]}" cy="{d[1]}" r="{A["dotr"]}" fill="{d[2]}"/>' for d in A['dots'])
t = m['t']
words = ''.join(f'<path d="{text(l)}"/>' for l in cfg['lines'])
label = 'Electrocoating &amp; Insulation Technologies Pvt. Ltd.'
open(sys.argv[2], 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 359 101" role="img" aria-label="{label}"><title>{label}</title>'
    f'<defs>{defs}</defs><g transform="translate({t[0]} {t[1]}) scale({t[2]})">{body}</g>'
    f'<g class="wordmark" fill="{NAVY}" stroke="{NAVY}" stroke-width=".12" stroke-linejoin="round">{words}</g></svg>')
open(sys.argv[3], 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 404 404"><defs>{defs}</defs>{body}</svg>')
