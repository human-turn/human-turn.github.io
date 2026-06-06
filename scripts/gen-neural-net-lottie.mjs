// Генератор Lottie-анимации «как работает простая нейросеть» (без After Effects).
// Сюжет: книги влетают -> архивируются в хранилище -> перцептрон прогоняет сигнал -> на выходе «?» -> «✓».
// Запуск: node scripts/gen-neural-net-lottie.mjs  ->  public/neural-net.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OP = 180; // 6 секунд при 30 fps
const EI = { x: [0.42], y: [1] };
const EO = { x: [0.58], y: [0] };

const stat = (v) => ({ a: 0, k: v });
// points: [[frame, value], ...] (value — число или массив) -> анимированное свойство
function anim(points) {
	const k = points.map((p, i) => {
		const s = Array.isArray(p[1]) ? p[1] : [p[1]];
		const kf = { t: p[0], s };
		if (i < points.length - 1) {
			kf.i = EI;
			kf.o = EO;
		}
		return kf;
	});
	return { a: 1, k };
}

const fill = (c) => ({ ty: 'fl', c: stat(c), o: stat(100), r: 1, bm: 0, nm: 'fill' });
const stroke = (c, w) => ({
	ty: 'st',
	c: stat(c),
	o: stat(100),
	w: stat(w),
	lc: 2,
	lj: 2,
	bm: 0,
	nm: 'stroke',
});
const trGroup = () => ({
	ty: 'tr',
	p: stat([0, 0]),
	a: stat([0, 0]),
	s: stat([100, 100]),
	r: stat(0),
	o: stat(100),
	nm: 'tr',
});
const rect = (w, h, r) => ({
	ty: 'rc',
	d: 1,
	s: stat([w, h]),
	p: stat([0, 0]),
	r: stat(r),
	nm: 'rc',
});
const ellipse = (d) => ({ ty: 'el', d: 1, s: stat([d, d]), p: stat([0, 0]), nm: 'el' });
const pathLine = (x1, y1, x2, y2) => ({
	ty: 'sh',
	d: 1,
	ks: stat({
		i: [
			[0, 0],
			[0, 0],
		],
		o: [
			[0, 0],
			[0, 0],
		],
		v: [
			[x1, y1],
			[x2, y2],
		],
		c: false,
	}),
	nm: 'sh',
});
const trim = (eProp) => ({ ty: 'tm', s: stat(0), e: eProp, o: stat(0), m: 1, nm: 'trim' });

function mkKs({ o, p, a, s, r } = {}) {
	return {
		o: o ?? stat(100),
		r: r ?? stat(0),
		p: p ?? stat([0, 0, 0]),
		a: a ?? stat([0, 0, 0]),
		s: s ?? stat([100, 100, 100]),
	};
}
const grp = (it, nm) => ({ ty: 'gr', it: [...it, trGroup()], nm });
const shapeLayer = (ind, nm, shapes, ks) => ({
	ddd: 0,
	ind,
	ty: 4,
	nm,
	sr: 1,
	ks,
	ao: 0,
	shapes,
	ip: 0,
	op: OP,
	st: 0,
	bm: 0,
});

function textLayer(ind, nm, txt, x, y, size, color, oProp, sProp) {
	return {
		ddd: 0,
		ind,
		ty: 5,
		nm,
		sr: 1,
		ks: mkKs({ o: oProp, p: stat([x, y, 0]), s: sProp }),
		ao: 0,
		t: {
			d: {
				k: [
					{
						s: { s: size, f: 'main', t: txt, ca: 0, j: 2, tr: 0, lh: size * 1.2, ls: 0, fc: color },
						t: 0,
					},
				],
			},
			p: {},
			m: { g: 1, a: stat([0, 0, 0]) },
			a: [],
		},
		ip: 0,
		op: OP,
		st: 0,
		bm: 0,
	};
}

const C = {
	book1: [0.231, 0.51, 0.965, 1],
	book2: [0.13, 0.7, 0.5, 1],
	book3: [0.96, 0.62, 0.18, 1],
	boxFill: [0.886, 0.91, 0.96, 1],
	boxStroke: [0.5, 0.56, 0.7, 1],
	input: [0.42, 0.47, 0.57, 1],
	neuron: [0.49, 0.36, 0.96, 1],
	output: [0.13, 0.7, 0.5, 1],
	line: [0.49, 0.36, 0.96, 1],
	qText: [0.2, 0.24, 0.32],
	aText: [0.09, 0.6, 0.42],
};

const NEURON = [500, 185];
const INPUTS = [
	[360, 110],
	[360, 185],
	[360, 260],
];
const OUTPUT = [640, 185];

const layers = [];
let ind = 1;
const push = (l) => {
	layers.push(l);
	ind += 1;
};

// «?» (вопрос) — гаснет, когда модель ответила
push(
	textLayer(
		ind,
		'q',
		'?',
		430,
		78,
		46,
		C.qText,
		anim([
			[0, 100],
			[126, 100],
			[138, 0],
		]),
	),
);
// «✓» (ответ) — появляется в конце
push(
	textLayer(
		ind,
		'answer',
		'✓',
		640,
		120,
		46,
		C.aText,
		anim([
			[0, 0],
			[140, 0],
			[152, 100],
		]),
		anim([
			[0, [60, 60, 100]],
			[140, [60, 60, 100]],
			[152, [120, 120, 100]],
			[160, [100, 100, 100]],
		]),
	),
);
// выходной нейрон
push(
	shapeLayer(
		ind,
		'output',
		[grp([ellipse(42), fill(C.output)], 'out')],
		mkKs({
			p: stat([...OUTPUT, 0]),
			s: anim([
				[0, [100, 100, 100]],
				[138, [100, 100, 100]],
				[146, [132, 132, 100]],
				[156, [100, 100, 100]],
			]),
		}),
	),
);
// нейрон-перцептрон
push(
	shapeLayer(
		ind,
		'neuron',
		[grp([ellipse(58), fill(C.neuron)], 'n')],
		mkKs({
			p: stat([...NEURON, 0]),
			s: anim([
				[0, [100, 100, 100]],
				[108, [100, 100, 100]],
				[116, [132, 132, 100]],
				[128, [100, 100, 100]],
			]),
		}),
	),
);
// входные нейроны (пульсируют по очереди)
const inPulse = [
	[76, 82, 90],
	[80, 86, 94],
	[84, 90, 98],
];
INPUTS.forEach((pos, i) => {
	const [a, b, c] = inPulse[i];
	push(
		shapeLayer(
			ind,
			`input${i + 1}`,
			[grp([ellipse(34), fill(C.input)], 'in')],
			mkKs({
				p: stat([...pos, 0]),
				s: anim([
					[0, [100, 100, 100]],
					[a, [100, 100, 100]],
					[b, [128, 128, 100]],
					[c, [100, 100, 100]],
				]),
			}),
		),
	);
});
// связь нейрон -> выход (рисуется trim-path'ом)
push(
	shapeLayer(
		ind,
		'lineNO',
		[
			grp(
				[
					pathLine(NEURON[0], NEURON[1], OUTPUT[0], OUTPUT[1]),
					stroke(C.line, 4),
					trim(
						anim([
							[0, 0],
							[124, 0],
							[140, 100],
						]),
					),
				],
				'lno',
			),
		],
		mkKs({}),
	),
);
// связи входы -> нейрон
INPUTS.forEach((pos, i) => {
	const sf = 88 + i * 2;
	const ef = 108 + i * 2;
	push(
		shapeLayer(
			ind,
			`lineIN${i + 1}`,
			[
				grp(
					[
						pathLine(pos[0], pos[1], NEURON[0], NEURON[1]),
						stroke(C.line, 4),
						trim(
							anim([
								[0, 0],
								[sf, 0],
								[ef, 100],
							]),
						),
					],
					'lin',
				),
			],
			mkKs({}),
		),
	);
});
// хранилище-«архив» (пульсирует на каждой влетающей книге)
push(
	shapeLayer(
		ind,
		'archive',
		[grp([rect(98, 122, 14), fill(C.boxFill), stroke(C.boxStroke, 3)], 'box')],
		mkKs({
			p: stat([180, 185, 0]),
			s: anim([
				[0, [100, 100, 100]],
				[24, [100, 100, 100]],
				[30, [112, 112, 100]],
				[36, [100, 100, 100]],
				[40, [100, 100, 100]],
				[46, [112, 112, 100]],
				[52, [100, 100, 100]],
				[58, [100, 100, 100]],
				[64, [112, 112, 100]],
				[70, [100, 100, 100]],
			]),
		}),
	),
);
// книги влетают слева и «всасываются» в архив
push(
	shapeLayer(
		ind,
		'book1',
		[grp([rect(46, 32, 5), fill(C.book1)], 'b1')],
		mkKs({
			p: anim([
				[0, [-60, 150, 0]],
				[24, [180, 150, 0]],
			]),
			o: anim([
				[0, 100],
				[26, 100],
				[34, 0],
			]),
		}),
	),
);
push(
	shapeLayer(
		ind,
		'book2',
		[grp([rect(46, 32, 5), fill(C.book2)], 'b2')],
		mkKs({
			p: anim([
				[14, [-60, 185, 0]],
				[40, [180, 185, 0]],
			]),
			o: anim([
				[0, 100],
				[42, 100],
				[50, 0],
			]),
		}),
	),
);
push(
	shapeLayer(
		ind,
		'book3',
		[grp([rect(46, 32, 5), fill(C.book3)], 'b3')],
		mkKs({
			p: anim([
				[30, [-60, 220, 0]],
				[58, [180, 220, 0]],
			]),
			o: anim([
				[0, 100],
				[60, 100],
				[68, 0],
			]),
		}),
	),
);
// фон-панель
push(
	shapeLayer(
		ind,
		'bg',
		[grp([rect(804, 344, 22), fill([0.965, 0.975, 0.992, 1])], 'panel')],
		mkKs({ p: stat([410, 180, 0]) }),
	),
);

const data = {
	v: '5.9.0',
	fr: 30,
	ip: 0,
	op: OP,
	w: 820,
	h: 360,
	nm: 'neural-net',
	ddd: 0,
	assets: [],
	fonts: {
		list: [{ fName: 'main', fFamily: 'Arial', fStyle: 'Bold', fWeight: '700', ascent: 72 }],
	},
	layers,
};

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'neural-net.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data));
console.log('wrote', out, '| layers:', layers.length);
