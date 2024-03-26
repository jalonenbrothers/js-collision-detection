import Point from './point.js';
import Segment from './segment.js';
import { getIntersection, average, angle, getRandomColor } from '../math/utils.js';

export default class Polygon {
    constructor(points, sort=false) {
        this.points = points;
        this.segments = [];

        if(sort){
            // Sorting points before creating segments
            // Gives random shapes a bit better structure
            this.findAngles(this.findCenter());
    
            // sort based on angle 
            this.points.sort(function(a, b) {
                return (a.angle <= b.angle) ? -1 : 1
            });
        }

        for (let i = 1; i <= this.points.length; i++) {
            this.segments.push(
                // modulo allows return 0 instead of error when i == points.length; returns back, closes loop
                new Segment(this.points[i - 1], this.points[i % this.points.length]) 
            );
        }
    }

    findAngles(c) {
        let len = this.points.length, p, dx, dy;
      
        for (let i = 0; i < len; i++) {
            p = this.points[i];
            dx = p.x - c.x;
            dy = p.y - c.y;
            p.angle = angle(p);
        }
    }

    findCenter() {
        let x = 0, y = 0, len = this.points.length;
      
        for (let i = 0; i < len; i++) {
            x += this.points[i].x;
            y += this.points[i].y;
        }
        return {x: x / len, y: y / len};   // return average position
    }

    distanceToPoint(point) {
        return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
    }

    distanceToPoly(poly) {
        return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
    }

    //poly (this) intersects poly (param)
    intersectsPoly(poly) {
        for (let s1 of this.segments) {
            for (let s2 of poly.segments) {
                if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
                    return true;
                }
            }
        }
        return false;
    }

    getIntersectingSegments(poly) {
        const intersections = [];
        for (let s1 of this.segments) {
            for (let s2 of poly.segments) {
                if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
                    intersections.push(...[s1, s2]);
                }
            }
        }
        if(intersections.length) { return intersections; }
        return false;
    }

    containsSegment(seg){
        const midpoint = average(seg.p1, seg.p2);
        return this.containsPoint(midpoint);
    }

    // if a segment from point to outerPoint (outside of everything hopefully)
    // intersects polygon even number of times, it's outside, odd times, it's inside
    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000);
        let intersectionCount = 0;
        for (const seg of this.segments) {
            const inters = getIntersection(outerPoint, point, seg.p1, seg.p2);
            if (inters) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1;
    }

    drawSegments(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx, { color: getRandomColor(), width: 5 });
        }
    }

    draw(ctx, { stroke = "blue", lineWidth = 1, fill = "rgba(0,0,255,0.3)" } = {} ) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke()
    }
}