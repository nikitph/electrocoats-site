# Logo (vector redraw)

`public/img/logo.svg` and `public/img/mark.svg` are vector redraws of the original
raster logo (`public/img/logo.png`), fitted against it pixel by pixel. The wordmark is
outlined Times New Roman Bold, so it renders identically without the font installed.

Rebuild (macOS, needs `pip install fonttools`):

    python tools/logo/build_logo.py tools/logo/geometry.json public/img/logo.svg public/img/mark.svg
