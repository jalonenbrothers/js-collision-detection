import Point from '../primitives/point.js';

export function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

//average of a vector point - as in midpoint of line
export function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

export function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

export function normalize(p){
    return scale(p, 1 / magnitude(p));
}

//distance to the origin
export function magnitude(p){
    return Math.hypot(p.x, p.y);
}

export function angle(p) {
     return Math.atan2(p.y, p.x);
}

export function getIntersection(A,B,C,D) {
    /*
    Ix = Ax + (Bx - Ax)t = Cx + (Dx-Cx)u
    Iy = Ay + (By - Ay)t = Cy + (Dy-Cy)u
    
    Ax + (Bx - Ax)t = Cx + (Dx-Cx)u  | - Cx
    (Ax - Cx) + (Bx - Ax)t = (Dx-Cx)u  *** (Dx-Cx)u used later

    Ay + (By - Ay)t = Cy + (Dy-Cy)u  | - Cy
    (Ay - Cy) + (By - Ay)t = (Dy-Cy)u | * (Dx-Cx) 
    (Dx-Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy-Cy)(Dx-Cx)u
    (Dx-Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy-Cy)(Ax - Cx) + (Dy-Cy)(Bx - Ax)t | - (Dy-Cy)(Ax - Cx)
                                                                                  | - (Dx - Cx)(By - Ay)t
    (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx) = ((Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay))t

    ->

    t = ((Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx)) / ((Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay))

    top = (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx)
    bottom = (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)

    t = top / bottom; // make sure bottom != 0

    */
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    const eps = 0.001;
   // if(bottom != 0) { //causes floating point issues
    if(Math.abs(bottom) > eps) {
            const t = tTop / bottom;
        const u = uTop / bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                bottom: bottom,
                offset: t
            };
        }
    }
    return null;
}

// see also https://en.wikipedia.org/wiki/Linear_interpolation
export function lerp(a, b, t) {
    //points on the line Ax + (Bx - Ax)t & Ay + (By - Ay)t
    //where 0 <= t <= 1 (ie. between A and B)
    //return a + (b - a) * t; //imprecise
    return (1 - t) * a + t * b; //precise
}

export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}

export function getRandomIntInclusive(min, max) {
    let offset = 0;
    if(min < 0) {
        max = max - min;
        offset = min;
    } 
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return offset + Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}