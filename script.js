var c = document.getElementById('alx');

var b = document.body;
var a = c.getContext('2d');


e = [];
h = [];
WIDTH = c.width = innerWidth;
HEIGHT = c.height = innerHeight;
v = 32 + 16 + 8;
R = Math.random;
C = Math.cos;
Y = 6.3;

for (i = 0; i < Y; i += 0.2)
    h.push([WIDTH / 2 + 180 * Math.pow(Math.sin(i), 3),
    HEIGHT / 2 + 13 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))]);

for (i = 0; i < Y; i += 0.4)
    h.push([WIDTH / 2 + 130 * Math.pow(Math.sin(i), 3),
    HEIGHT / 2 + 9 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))]);

for (i = 0; i < Y; i += 0.8)
    h.push([WIDTH / 2 + 75 * Math.pow(Math.sin(i), 3),
    HEIGHT / 2 + 5 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i))]);

for (i = 0; i < v;) {
    x = R() * WIDTH;
    y = R() * HEIGHT;
    H = 320 + (i / v) * 40;  // Màu từ đỏ (0) sang hồng (340-360)
    S = 80 + R() * 20;       // Độ bão hòa cao
    B = 50 + R() * 30;       // Độ sáng vừa phải
    f = [];
    for (k = 0; k < v;) f[k++] = {
        x: x,
        y: y,
        X: 0,
        Y: 0,
        R: 1 - k / v + 1,
        S: R() + 1,
        q: ~~(R() * v),
        D: 2 * (i % 2) - 1,
        F: 0.2 * R() + 0.7,
        f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)"
    };
    e[i++] = f
}

function path(d) {
    a.fillStyle = d.f;
    a.beginPath();
    a.arc(d.x, d.y, d.R, 0, Y, 1);
    a.closePath();
    a.fill()
}

// Mảng chứa các trái tim bay lên
var flyingHearts = [];
// Mảng chứa các chữ bay lên
var flyingTexts = [];

// Tạo trái tim bay lên
function createFlyingHeart() {
    var colors = [
        'hsl(350, 100%, 88%)',  // Hồng nhạt
        'hsl(0, 0%, 100%)',      // Trắng
        'hsl(340, 100%, 85%)',   // Hồng nhạt hơn
        'hsl(355, 100%, 90%)'    // Hồng rất nhạt
    ];
    var heart = {
        x: R() * WIDTH,
        y: HEIGHT + 30,
        size: R() * 10 + 8,  // Kích thước nhỏ hơn: 8-18px
        speed: R() * 2 + 1,
        opacity: 1,
        swing: R() * Math.PI * 2,
        swingSpeed: R() * 0.05 + 0.02,
        color: colors[~~(R() * colors.length)]
    };
    flyingHearts.push(heart);
}

// Vẽ hình trái tim
function drawFlyingHeart(heart) {
    a.save();
    a.globalAlpha = heart.opacity;
    a.fillStyle = heart.color;
    a.beginPath();

    var x = heart.x;
    var y = heart.y;
    var size = heart.size;
    var topCurveHeight = size * 0.3;

    a.moveTo(x, y + topCurveHeight);
    a.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    a.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
    a.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    a.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);

    a.closePath();
    a.fill();
    a.restore();
}

// Tạo chữ "Ngọc Linh" bay lên
function createFlyingText() {
    var colors = [
        'hsl(350, 100%, 88%)',  // Hồng nhạt
        'hsl(0, 0%, 100%)',      // Trắng
        'hsl(340, 100%, 85%)',   // Hồng nhạt hơn
        'hsl(355, 100%, 90%)'    // Hồng rất nhạt
    ];
    var text = {
        x: R() * WIDTH,
        y: HEIGHT + 30,
        speed: R() * 1.5 + 0.8,
        opacity: 1,
        swing: R() * Math.PI * 2,
        swingSpeed: R() * 0.03 + 0.01,
        fontSize: R() * 10 + 16,  // Kích thước nhỏ hơn: 16-26px
        color: colors[~~(R() * colors.length)]
    };
    flyingTexts.push(text);
}

// Vẽ chữ bay lên
function drawFlyingText(text) {
    a.save();
    a.globalAlpha = text.opacity;
    a.fillStyle = text.color;
    a.font = text.fontSize + 'px Arial';
    a.textAlign = 'center';
    a.fillText('Ngọc Linh', text.x, text.y);
    a.restore();
}

setInterval(function () {
    a.fillStyle = "rgba(0,0,0,.2)";
    a.fillRect(0, 0, WIDTH, HEIGHT);

    // Vẽ hiệu ứng trái tim ban đầu
    for (i = v; i--;) {
        f = e[i];
        u = f[0];
        q = h[u.q];
        D = u.x - q[0];
        E = u.y - q[1];
        G = Math.sqrt(D * D + E * E);
        10 > G && (0.95 < R() ? u.q = ~~(R() * v) : (0.99 < R() && (u.D *= -1), u.q += u.D, u.q %= v, 0 > u.q && (u.q += v)));
        u.X += -D / G * u.S;
        u.Y += -E / G * u.S;
        u.x += u.X;
        u.y += u.Y;
        path(u);
        u.X *= u.F;
        u.Y *= u.F;
        for (k = 0; k < v - 1;) T = f[k], N = f[++k], N.x -= 0.7 * (N.x - T.x), N.y -= 0.7 * (N.y - T.y), path(N)
    }

    // Cập nhật và vẽ các trái tim bay lên
    for (var j = flyingHearts.length - 1; j >= 0; j--) {
        var heart = flyingHearts[j];

        heart.y -= heart.speed;
        heart.swing += heart.swingSpeed;
        heart.x += Math.sin(heart.swing) * 0.5;

        if (heart.y < HEIGHT / 2) {
            heart.opacity -= 0.005;
        }

        drawFlyingHeart(heart);

        if (heart.y < -100 || heart.opacity <= 0) {
            flyingHearts.splice(j, 1);
        }
    }

    // Cập nhật và vẽ các chữ bay lên
    for (var m = flyingTexts.length - 1; m >= 0; m--) {
        var txt = flyingTexts[m];

        txt.y -= txt.speed;
        txt.swing += txt.swingSpeed;
        txt.x += Math.sin(txt.swing) * 0.3;

        if (txt.y < HEIGHT / 2) {
            txt.opacity -= 0.003;
        }

        drawFlyingText(txt);

        if (txt.y < -100 || txt.opacity <= 0) {
            flyingTexts.splice(m, 1);
        }
    }
}, 25);

// Tạo trái tim bay lên định kỳ
setInterval(createFlyingHeart, 300);

// Tạo chữ "Ngọc Linh" bay lên định kỳ
setInterval(createFlyingText, 800);

// Xử lý resize
window.addEventListener('resize', function () {
    WIDTH = c.width = innerWidth;
    HEIGHT = c.height = innerHeight;
});