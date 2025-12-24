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

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

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

    // Khởi tạo một số trái tim (giảm cho mobile)
    var initialHearts = mobile ? 8 : 15;
    for (var h = 0; h < initialHearts; h++) {
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

    // Khởi tạo một số chữ (giảm cho mobile)
    var initialTexts = mobile ? 2 : 3;
    for (var t = 0; t < initialTexts; t++) {
        var text = createFloatingText();
        text.y = rand() * height;
        floatingTexts.push(text);
    }

    // Hàm vẽ chữ "Ngọc Linh" với hiệu ứng phát sáng
    var drawFloatingText = function (x, y, fontSize, opacity, color, shadowColor) {
        ctx.save();
        ctx.globalAlpha = opacity;

        // Hiệu ứng phát sáng (giảm blur cho mobile)
        if (!mobile) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = shadowColor;
        }

        ctx.fillStyle = color + opacity + ')';
        ctx.font = 'bold ' + fontSize + 'px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Ngọc Linh', x, y);
        ctx.restore();
    };

    var loop = function () {
        ctx.fillStyle = mobile ? "rgba(0,0,0,.05)" : "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);

        // Update các trái tim bay lên (không vẽ ngay)
        for (var j = floatingHearts.length - 1; j >= 0; j--) {
            var fh = floatingHearts[j];
            fh.y -= fh.speed;
            fh.angle += fh.swaySpeed;
            fh.x += Math.sin(fh.angle) * fh.sway;

            // Tạo lại trái tim khi nó bay ra khỏi màn hình
            if (fh.y < -30) {
                floatingHearts[j] = createFloatingHeart();
            }
        }

        // Tạo trái tim mới ngẫu nhiên (giảm tần suất và số lượng tối đa cho mobile)
        var heartSpawnRate = mobile ? 0.01 : 0.02;
        var maxHearts = mobile ? 15 : 30;
        if (rand() < heartSpawnRate) {
            floatingHearts.push(createFloatingHeart());
            if (floatingHearts.length > maxHearts) {
                floatingHearts.shift();
            }
        }

        // Update các chữ "Ngọc Linh" bay lên (không vẽ ngay)
        for (var m = floatingTexts.length - 1; m >= 0; m--) {
            var ft = floatingTexts[m];
            ft.y -= ft.speed;
            ft.angle += ft.swaySpeed;
            ft.x += Math.sin(ft.angle) * ft.sway;

            // Tạo lại chữ khi nó bay ra khỏi màn hình
            if (ft.y < -50) {
                floatingTexts[m] = createFloatingText();
            }
        }

        // Tạo chữ mới ngẫu nhiên (giảm tần suất và số lượng tối đa cho mobile)
        var textSpawnRate = mobile ? 0.008 : 0.015;
        var maxTexts = mobile ? 10 : 20;
        if (rand() < textSpawnRate) {
            floatingTexts.push(createFloatingText());
            if (floatingTexts.length > maxTexts) {
                floatingTexts.shift();
            }
        }

        // Vẽ trái tim nhỏ và chữ trước (layer dưới)
        for (var j = 0; j < floatingHearts.length; j++) {
            var fh = floatingHearts[j];
            drawSmallHeart(fh.x, fh.y, fh.size, fh.color, fh.opacity);
        }

        for (var m = 0; m < floatingTexts.length; m++) {
            var ft = floatingTexts[m];
            drawFloatingText(ft.x, ft.y, ft.fontSize, ft.opacity, ft.color, ft.shadowColor);
        }

        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);