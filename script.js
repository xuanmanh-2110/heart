window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame || 7
window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) {
                lastTime = 0;
            }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();

window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));

var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    var heartPosition = function (rad) {
        return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };

    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    var traceCount = mobile ? 20 : 50;
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.3 : 0.1;
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: "hsla(330," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    var config = {
        traceK: 0.4,
        timeDelta: 0.01
    };

    // Thêm các trái tim bay lên
    var floatingHearts = [];
    var createFloatingHeart = function () {
        return {
            x: rand() * width,
            y: height + 20,
            size: rand() * 20 + 15,
            speed: rand() * 2 + 1,
            sway: rand() * 2 - 1,
            swaySpeed: rand() * 0.05 + 0.02,
            angle: 0,
            opacity: rand() * 0.5 + 0.5,
            color: rand() > 0.5 ? 'rgba(255, 182, 193, ' : 'rgba(255, 255, 255, '
        };
    };

    // Khởi tạo một số trái tim
    for (var h = 0; h < 15; h++) {
        var heart = createFloatingHeart();
        heart.y = rand() * height;
        floatingHearts.push(heart);
    }

    // Hàm vẽ trái tim nhỏ
    var drawSmallHeart = function (x, y, size, color, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color + opacity + ')';

        ctx.beginPath();
        var topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);

        // Cạnh trái
        ctx.bezierCurveTo(
            x, y,
            x - size / 2, y,
            x - size / 2, y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x - size / 2, y + (size + topCurveHeight) / 2,
            x, y + (size + topCurveHeight) / 2,
            x, y + size
        );

        // Cạnh phải
        ctx.bezierCurveTo(
            x, y + (size + topCurveHeight) / 2,
            x + size / 2, y + (size + topCurveHeight) / 2,
            x + size / 2, y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x + size / 2, y,
            x, y,
            x, y + topCurveHeight
        );

        ctx.fill();
        ctx.restore();
    };

    // Thêm chữ "Ngọc Linh" bay lên
    var floatingTexts = [];
    var createFloatingText = function () {
        var isPink = rand() > 0.5;
        return {
            x: rand() * width,
            y: height + 30,
            speed: rand() * 1.5 + 0.8,
            sway: rand() * 1.5 - 0.75,
            swaySpeed: rand() * 0.04 + 0.02,
            angle: 0,
            opacity: rand() * 0.4 + 0.6,
            fontSize: mobile ? rand() * 8 + 12 : rand() * 10 + 16,
            color: isPink ? 'rgba(255, 182, 193, ' : 'rgba(255, 255, 255, ',
            shadowColor: isPink ? 'rgba(255, 182, 193, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        };
    };

    // Khởi tạo một số chữ
    for (var t = 0; t < 8; t++) {
        var text = createFloatingText();
        text.y = rand() * height;
        floatingTexts.push(text);
    }

    // Hàm vẽ chữ "Ngọc Linh" với hiệu ứng phát sáng
    var drawFloatingText = function (x, y, fontSize, opacity, color, shadowColor) {
        ctx.save();
        ctx.globalAlpha = opacity;

        // Hiệu ứng phát sáng
        ctx.shadowBlur = 15;
        ctx.shadowColor = shadowColor;

        ctx.fillStyle = color + opacity + ')';
        ctx.font = 'bold ' + fontSize + 'px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Ngọc Linh', x, y);
        ctx.restore();
    };

    var time = 0;
    var loop = function () {
        var n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);

        // Vẽ và update các trái tim bay lên
        for (var j = floatingHearts.length - 1; j >= 0; j--) {
            var fh = floatingHearts[j];
            fh.y -= fh.speed;
            fh.angle += fh.swaySpeed;
            fh.x += Math.sin(fh.angle) * fh.sway;

            drawSmallHeart(fh.x, fh.y, fh.size, fh.color, fh.opacity);

            // Tạo lại trái tim khi nó bay ra khỏi màn hình
            if (fh.y < -30) {
                floatingHearts[j] = createFloatingHeart();
            }
        }

        // Tạo trái tim mới ngẫu nhiên
        if (rand() < 0.02) {
            floatingHearts.push(createFloatingHeart());
            if (floatingHearts.length > 30) {
                floatingHearts.shift();
            }
        }

        // Vẽ và update các chữ "Ngọc Linh" bay lên
        for (var m = floatingTexts.length - 1; m >= 0; m--) {
            var ft = floatingTexts[m];
            ft.y -= ft.speed;
            ft.angle += ft.swaySpeed;
            ft.x += Math.sin(ft.angle) * ft.sway;

            drawFloatingText(ft.x, ft.y, ft.fontSize, ft.opacity, ft.color, ft.shadowColor);

            // Tạo lại chữ khi nó bay ra khỏi màn hình
            if (ft.y < -50) {
                floatingTexts[m] = createFloatingText();
            }
        }

        // Tạo chữ mới ngẫu nhiên
        if (rand() < 0.015) {
            floatingTexts.push(createFloatingText());
            if (floatingTexts.length > 20) {
                floatingTexts.shift();
            }
        }

        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                } else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }
        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);