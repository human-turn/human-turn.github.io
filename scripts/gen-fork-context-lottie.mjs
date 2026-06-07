// Генератор Lottie-анимации «контекст-менеджмент форка» (без After Effects).
// Сюжет: главный диалог копит контекст -> /fork клонирует всю историю в фон ->
// форк перемалывает шумную работу (мусор копится) -> возвращает в диалог только
// итог (✓) -> промежуточный мусор утилизируется, главный диалог остаётся чистым.
// Запуск: node scripts/gen-fork-context-lottie.mjs  ->  public/fork-context.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OP = 270; // 9 секунд при 30 fps
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
const pathPoly = (pts, closed) => ({
	ty: 'sh',
	d: 1,
	ks: stat({
		i: pts.map(() => [0, 0]),
		o: pts.map(() => [0, 0]),
		v: pts,
		c: !!closed,
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

// Палитра в стиле Claude Code (терракот) на светлой панели.
const C = {
	page: [0.965, 0.969, 0.984, 1],
	panel: [1, 1, 1, 1],
	panelFork: [0.992, 0.965, 0.953, 1],
	line: [0.886, 0.894, 0.925, 1],
	accent: [0.851, 0.467, 0.341, 1], // #d97757
	accentSoft: [0.93, 0.66, 0.57, 1],
	dim: [0.55, 0.52, 0.48],
	histWarm: [0.9, 0.62, 0.52, 1],
	histWarm2: [0.83, 0.5, 0.4, 1],
	ghost: [0.86, 0.7, 0.64, 1],
	junk: [0.7, 0.71, 0.75, 1],
	ok: [0.13, 0.7, 0.5, 1],
	white: [1, 1, 1, 1],
};

// Геометрия холста
const MAIN_X = 250; // центр левой панели (главный диалог)
const FORK_X = 660; // центр правой панели (форк)
const HIST_Y = [150, 186, 222]; // строки истории в главном диалоге
const GHOST_Y = [150, 186, 222]; // куда ложатся строки-призраки в форке
const FORK_RESULT_Y = 372; // итог формируется внизу форка, под мусором
const RESULT_Y = 344; // куда приземляется итог в главном диалоге (под полем ввода)
const INPUT_Y = 300; // строка ввода главного диалога
const TITLE_Y = 86; // заголовки панелей — вынесены над рамками, на одном уровне
const PANEL_CY = 252; // общий центр панелей по вертикали (верх обеих на одном уровне)

const layers = [];
let ind = 1;
const push = (l) => {
	layers.push(l);
	ind += 1;
};

// плашка-«строка диалога»
const lineShape = (w, color) => grp([rect(w, 22, 7), fill(color)], 'line');

// ── ИТОГ: зелёная плашка с галочкой (формируется в форке -> летит в диалог) ──
push(
	shapeLayer(
		ind,
		'result',
		[
			// галочка поверх плашки
			grp(
				[
					pathPoly(
						[
							[-118, 0],
							[-108, 9],
							[-90, -10],
						],
						false,
					),
					stroke(C.white, 4),
					trim(
						anim([
							[160, 0],
							[176, 0],
							[188, 100],
						]),
					),
				],
				'check',
			),
			lineShape(280, C.ok),
		],
		mkKs({
			p: anim([
				[160, [FORK_X, FORK_RESULT_Y, 0]],
				[188, [FORK_X, FORK_RESULT_Y, 0]],
				[206, [MAIN_X, RESULT_Y, 0]],
			]),
			o: anim([
				[160, 0],
				[170, 100],
			]),
			s: anim([
				[160, [40, 40, 100]],
				[172, [112, 112, 100]],
				[180, [100, 100, 100]],
			]),
		}),
	),
);

// ── Подпись команды /fork в строке ввода главного диалога ──
push(
	textLayer(
		ind,
		'cmd',
		'/fork прогони тесты',
		MAIN_X,
		INPUT_Y,
		17,
		C.accent,
		stat(100),
		anim([
			[40, [100, 100, 100]],
			[48, [108, 108, 100]],
			[56, [100, 100, 100]],
		]),
	),
);

// ── Заголовки панелей ──
push(textLayer(ind, 'titleMain', 'главный диалог', MAIN_X, TITLE_Y, 18, C.dim, stat(100)));
push(
	textLayer(
		ind,
		'titleFork',
		'форк · фон',
		FORK_X,
		TITLE_Y,
		18,
		C.dim,
		anim([
			[44, 0],
			[60, 100],
			[214, 100],
			[236, 25],
		]),
	),
);

// ── Строки-призраки: копия истории, улетающая из диалога в форк ──
const ghostW = [256, 280, 224];
HIST_Y.forEach((y, i) => {
	const start = 56 + i * 8;
	const land = 88 + i * 8;
	push(
		shapeLayer(
			ind,
			`ghost${i + 1}`,
			[lineShape(ghostW[i], C.ghost)],
			mkKs({
				p: anim([
					[start, [MAIN_X, y, 0]],
					[land, [FORK_X, GHOST_Y[i], 0]],
				]),
				o: anim([
					[start, 0],
					[start + 8, 70],
					[210, 70],
					[228, 0],
				]),
			}),
		),
	);
});

// ── Мусор: шумные блоки логов копятся в форке и затем утилизируются ──
const junk = [
	{ w: 150, y: 258, app: 96 },
	{ w: 120, y: 280, app: 110 },
	{ w: 168, y: 302, app: 124 },
	{ w: 108, y: 324, app: 138 },
	{ w: 140, y: 346, app: 152 },
];
junk.forEach((j, i) => {
	push(
		shapeLayer(
			ind,
			`junk${i + 1}`,
			[grp([rect(j.w, 14, 5), fill(C.junk)], 'j')],
			mkKs({
				p: stat([FORK_X, j.y, 0]),
				o: anim([
					[j.app, 0],
					[j.app + 8, 100],
					[210, 100],
					[224 + i * 2, 0],
				]),
				s: anim([
					[j.app, [60, 60, 100]],
					[j.app + 8, [100, 100, 100]],
					// лёгкое дрожание «работы»
					[j.app + 24, [100, 100, 100]],
					[j.app + 30, [103, 103, 100]],
					[j.app + 36, [100, 100, 100]],
					[210, [100, 100, 100]],
					[224 + i * 2, [0, 0, 100]],
				]),
			}),
		),
	);
});

// ── История в главном диалоге (накопленный контекст, всегда виден) ──
const histW = [256, 280, 224];
const histC = [C.histWarm, C.histWarm2, C.histWarm];
HIST_Y.forEach((y, i) => {
	push(
		shapeLayer(
			ind,
			`hist${i + 1}`,
			[lineShape(histW[i], histC[i])],
			mkKs({ p: stat([MAIN_X, y, 0]) }),
		),
	);
});

// ── Строка ввода главного диалога ──
push(
	shapeLayer(
		ind,
		'input',
		[grp([rect(320, 36, 9), fill(C.panel), stroke(C.line, 2)], 'inp')],
		mkKs({ p: stat([MAIN_X, INPUT_Y, 0]) }),
	),
);

// ── Панель форка (проявляется на /fork, тускнеет после возврата итога) ──
push(
	shapeLayer(
		ind,
		'panelFork',
		[grp([rect(360, 296, 18), fill(C.panelFork), stroke(C.accentSoft, 2)], 'pf')],
		mkKs({
			p: stat([FORK_X, PANEL_CY, 0]),
			o: anim([
				[44, 0],
				[60, 100],
				[214, 100],
				[236, 18],
			]),
			s: anim([
				[44, [92, 92, 100]],
				[60, [100, 100, 100]],
			]),
		}),
	),
);

// ── Панель главного диалога ──
push(
	shapeLayer(
		ind,
		'panelMain',
		[grp([rect(380, 296, 18), fill(C.panel), stroke(C.line, 2)], 'pm')],
		mkKs({ p: stat([MAIN_X, PANEL_CY, 0]) }),
	),
);

// ── Фон ──
push(
	shapeLayer(
		ind,
		'bg',
		[grp([rect(900, 440, 0), fill(C.page)], 'panel')],
		mkKs({ p: stat([450, 220, 0]) }),
	),
);

const data = {
	v: '5.9.0',
	fr: 30,
	ip: 0,
	op: OP,
	w: 900,
	h: 440,
	nm: 'fork-context',
	ddd: 0,
	assets: [],
	fonts: {
		list: [{ fName: 'main', fFamily: 'Arial', fStyle: 'Regular', fWeight: '400', ascent: 72 }],
	},
	layers,
};

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'fork-context.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data));
console.log('wrote', out, '| layers:', layers.length);
