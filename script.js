
const pageNames = {
    dashboard: "Bosh sahifa",
    sets: "To‘plamlar",
    operations: "To‘plamlar amallari",
    sorting: "Saralash",
    relations: "Munosabatlar",
    combinatorics: "Kombinatorika",
    path: "Eng qisqa yo‘l"
};

const descriptions = {
    sets: "To‘plam elementlari va ularning xususiyatlarini o‘rganish.",
    operations: "Ikki to‘plam ustida matematik amallar bajarish.",
    sorting: "Sonlarni belgilangan tartibda saralash.",
    relations: "Munosabat matritsasining xususiyatlarini tekshirish.",
    combinatorics: "Faktorial, o‘rinlashtirish va guruhlashni hisoblash.",
    path: "Dijkstra algoritmi yordamida eng qisqa masofani topish."
};

function navigate(page) {
    document.getElementById("dashboardPage").hidden = page !== "dashboard";
    document.getElementById("workspacePage").hidden = page === "dashboard";
    document.getElementById("pageHeading").textContent = pageNames[page];

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    if (page !== "dashboard") {
        document.getElementById("moduleTitle").textContent = pageNames[page];
        document.getElementById("moduleDescription").textContent = descriptions[page];
        clearResult();
        renderForm(page);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderForm(page) {
    const forms = {
        sets: `
            <div class="field">
                <label>To‘plam elementlari</label>
                <input id="setValues" placeholder="1, 2, 3, 4, 5">
            </div>
            <p class="hint">Sonlarni vergul bilan ajrating.</p>
            <button class="calculate-btn" onclick="calculateSet()">Hisoblash →</button>
        `,
        operations: `
            <div class="field">
                <label>A to‘plami</label>
                <input id="setA" placeholder="1, 2, 3">
            </div>
            <div class="field">
                <label>B to‘plami</label>
                <input id="setB" placeholder="2, 3, 4">
            </div>
            <div class="field">
                <label>Amal</label>
                <select id="setOperation">
                    <option value="union">Birlashma (A ∪ B)</option>
                    <option value="intersection">Kesishma (A ∩ B)</option>
                    <option value="difference">Ayirma (A − B)</option>
                    <option value="symmetric">Simmetrik ayirma (A △ B)</option>
                </select>
            </div>
            <button class="calculate-btn" onclick="calculateOperation()">Hisoblash →</button>
        `,
        sorting: `
            <div class="field">
                <label>Sonlar</label>
                <input id="sortValues" placeholder="8, 3, 12, 1, 5">
            </div>
            <div class="field">
                <label>Saralash tartibi</label>
                <select id="sortOrder">
                    <option value="asc">O‘sish tartibida</option>
                    <option value="desc">Kamayish tartibida</option>
                </select>
            </div>
            <button class="calculate-btn" onclick="calculateSort()">Saralash →</button>
        `,
        relations: `
            <div class="field">
                <label>Munosabat matritsasi</label>
                <textarea id="relationMatrix" placeholder="1,0,1; 0,1,0; 1,0,1"></textarea>
            </div>
            <p class="hint">Qatorlarni nuqtali vergul bilan ajrating. Faqat 0 va 1 kiriting.</p>
            <button class="calculate-btn" onclick="calculateRelation()">Tekshirish →</button>
        `,
        combinatorics: `
            <div class="field">
                <label>n qiymati (0–170)</label>
                <input id="combN" type="number" min="0" max="170" value="5">
            </div>
            <div class="field">
                <label>r qiymati</label>
                <input id="combR" type="number" min="0" value="2">
            </div>
            <button class="calculate-btn" onclick="calculateCombinatorics()">Hisoblash →</button>
        `,
        path: `
            <div class="field">
                <label>Graf qirralari va masofalari</label>
                <textarea id="graphEdges" placeholder="A,B,4; A,C,2; C,B,1; B,D,5; C,D,8"></textarea>
            </div>
            <p class="hint">Format: A,B,4. Qirralar orasiga nuqtali vergul qo‘ying. Qirralar ikki tomonlama deb olinadi.</p>
            <div class="field">
                <label>Boshlang‘ich tugun</label>
                <input id="startNode" value="A">
            </div>
            <div class="field">
                <label>Yakuniy tugun</label>
                <input id="endNode" value="D">
            </div>
            <button class="calculate-btn" onclick="calculatePath()">Eng qisqa yo‘l →</button>
            `
    };

    document.getElementById("formArea").innerHTML = forms[page] || "";
}

function showResult(message, error = false) {
    const result = document.getElementById("result");
    result.textContent = message;
    result.className = error ? "result-error" : "result-value";
}

function clearResult() {
    const result = document.getElementById("result");
    result.className = "";
    result.innerHTML = `
        <div class="empty-result">
            <div>∑</div>
            <h3>Natija shu yerda chiqadi</h3>
            <p>Qiymatlarni kiriting va hisoblash tugmasini bosing.</p>
        </div>`;
}

function readSet(id) {
    const raw = document.getElementById(id).value.trim();

    if (!raw) {
        throw new Error("Iltimos, to‘plam elementlarini kiriting.");
    }

    return [...new Set(raw.split(",").map(item => {
        if (item.trim() === "") {
            throw new Error("Bo‘sh element kiritmang.");
        }

        const value = Number(item.trim());

        if (!Number.isFinite(value)) {
            throw new Error("Faqat sonlarni vergul bilan ajratib kiriting.");
        }

        return value;
    }))];
}

function calculateSet() {
    try {
        const values = readSet("setValues");

        showResult(
            "TO‘PLAM NATIJASI\n\n" +
            "A = {" + values.join(", ") + "}\n\n" +
            "Elementlar soni: " + values.length
        );
    } catch (error) {
        showResult(error.message, true);
    }
}

function calculateOperation() {
    try {
        const A = readSet("setA");
        const B = readSet("setB");
        const op = document.getElementById("setOperation").value;
        let answer;
        let symbol;

        if (op === "union") {
            answer = [...new Set([...A, ...B])];
            symbol = "A ∪ B";
        } else if (op === "intersection") {
            answer = A.filter(x => B.includes(x));
            symbol = "A ∩ B";
        } else if (op === "difference") {
            answer = A.filter(x => !B.includes(x));
            symbol = "A − B";
        } else {
            answer = [
                ...A.filter(x => !B.includes(x)),
                ...B.filter(x => !A.includes(x))
            ];
            symbol = "A △ B";
        }

        showResult(
            "TO‘PLAMLAR AMALI\n\n" +
            "A = {" + A.join(", ") + "}\n" +
            "B = {" + B.join(", ") + "}\n\n" +
            symbol + " = {" + answer.join(", ") + "}\n" +
            "Elementlar soni: " + answer.length
        );
    } catch (error) {
        showResult(error.message, true);
    }
}

function calculateSort() {
    try {
        const values = readSet("sortValues");
        const order = document.getElementById("sortOrder").value;

        values.sort((a, b) => order === "asc" ? a - b : b - a);

        showResult(
            "SARALASH NATIJASI\n\n" +
            "Natija: " + values.join(", ") + "\n" +
            "Tartib: " + (order === "asc" ? "O‘sish" : "Kamayish") + "\n" +
            "Elementlar soni: " + values.length
        );
    } catch (error) {
        showResult(error.message, true);
    }
}

function calculateRelation() {
    try {
        const raw = document.getElementById("relationMatrix").value.trim();

        if (!raw) {
            throw new Error("Matritsani kiriting.");
        }

        const matrix = raw.split(";").map(row =>
            row.trim().split(",").map(value => {
                const v = value.trim();

                if (v !== "0" && v !== "1") {
                    throw new Error("Faqat 0 va 1 kiriting.");
                }

                return Number(v);
            })
        );

        const n = matrix.length;

        if (matrix.some(row => row.length !== n)) {
            throw new Error("Kvadrat matritsa kiriting: qator va ustunlar soni teng bo‘lsin.");
        }

        let reflexive = true;
        let symmetric = true;
        let antisymmetric = true;
        let transitive = true;

        for (let i = 0; i < n; i++) {
            if (matrix[i][i] !== 1) reflexive = false;

            for (let j = 0; j < n; j++) {
                if (matrix[i][j] === 1 && matrix[j][i] !== 1) {
                    symmetric = false;
                }

                if (i !== j && matrix[i][j] === 1 && matrix[j][i] === 1) {
                    antisymmetric = false;
                }

                for (let k = 0; k < n; k++) {
                    if (
                        matrix[i][j] === 1 &&
                        matrix[j][k] === 1 &&
                        matrix[i][k] !== 1
                    ) {
                        transitive = false;
                    }
                }
            }
        }

        showResult(
            "MUNOSABAT TAHLILI\n\n" +
            "Matritsa o‘lchami: " + n + " × " + n + "\n\n" +
            "Refleksiv: " + (reflexive ? "Ha" : "Yo‘q") + "\n" +
            "Simmetrik: " + (symmetric ? "Ha" : "Yo‘q") + "\n" +
            "Antisimmetrik: " + (antisymmetric ? "Ha" : "Yo‘q") + "\n" +
            "Tranzitiv: " + (transitive ? "Ha" : "Yo‘q")
        );
    } catch (error) {
        showResult(error.message, true);
    }
}

function factorial(n) {
    let answer = 1n;

    for (let i = 2; i <= n; i++) {
        answer *= BigInt(i);
    }

    return answer;
}

function calculateCombinatorics() {
    const n = Number(document.getElementById("combN").value);
    const r = Number(document.getElementById("combR").value);

    if (
        !Number.isInteger(n) ||
        !Number.isInteger(r) ||
        n < 0 || r < 0 || r > n || n > 170
    ) {
        showResult("0 ≤ r ≤ n ≤ 170 shartini bajaring.", true);
        return;
    }

    const factN = factorial(n);
    const factR = factorial(r);
    const factNR = factorial(n - r);

    showResult(
        "KOMBINATORIKA NATIJASI\n\n" +
        n + "! = " + factN.toString() + "\n\n" +
        "O‘rinlashtirish A(" + n + "," + r + ") = " +
        (factN / factNR).toString() + "\n\n" +
        "Guruhlash C(" + n + "," + r + ") = " +
        (factN / (factR * factNR)).toString()
    );
}

function calculatePath() {
    try {
        const raw = document.getElementById("graphEdges").value.trim();
        const start = document.getElementById("startNode").value.trim();
        const end = document.getElementById("endNode").value.trim();

        if (!raw || !start || !end) {
            throw new Error("Barcha maydonlarni to‘ldiring.");
        }

        const graph = new Map();

        function addNode(node) {
            if (!graph.has(node)) graph.set(node, []);
        }

        for (const edge of raw.split(";")) {
            const parts = edge.split(",").map(x => x.trim());

            if (parts.length !== 3 || !parts[0] || !parts[1]) {
                throw new Error("Qirra formati: A,B,4");
            }

            const [a, b] = parts;
            const weight = Number(parts[2]);

            if (parts[2] === "" || !Number.isFinite(weight) || weight < 0) {
                throw new Error("Masofa manfiy bo‘lmagan son bo‘lishi kerak.");
            }

            addNode(a);
            addNode(b);
            graph.get(a).push({ node: b, weight });
            graph.get(b).push({ node: a, weight });
        }

        if (!graph.has(start) || !graph.has(end)) {
            throw new Error("Boshlang‘ich va yakuniy tugunlar grafda bo‘lishi kerak.");
        }

        const distances = new Map();
        const previous = new Map();
        const visited = new Set();

        for (const node of graph.keys()) {
            distances.set(node, Infinity);
        }

        distances.set(start, 0);

        while (true) {
            let current = null;
            let smallest = Infinity;

            for (const [node, distance] of distances) {
                if (!visited.has(node) && distance < smallest) {
                    smallest = distance;
                    current = node;
                }
            }

            if (current === null || current === end) break;

            visited.add(current);

            for (const edge of graph.get(current)) {
                if (visited.has(edge.node)) continue;

                const candidate = distances.get(current) + edge.weight;

                if (candidate < distances.get(edge.node)) {
                    distances.set(edge.node, candidate);
                    previous.set(edge.node, current);
                }
            }
        }

        if (!Number.isFinite(distances.get(end))) {
            throw new Error("Ikki tugun orasida yo‘l topilmadi.");
        }

        const route = [];
        let current = end;

        while (current !== undefined) {
            route.unshift(current);
            if (current === start) break;
            current = previous.get(current);
        }

        if (route[0] !== start) {
            throw new Error("Yo‘lni tiklab bo‘lmadi.");
        }

        showResult(
            "DIJKSTRA ALGORITMI\n\n" +
            "Boshlanish: " + start + "\n" +
            "Tugash: " + end + "\n\n" +
            "Eng qisqa yo‘l:\n" + route.join(" → ") + "\n\n" +
            "Umumiy masofa: " + distances.get(end) + "\n" +
            "Tugunlar soni: " + graph.size
        );
    } catch (error) {
        showResult(error.message, true);
    }
}

navigate("dashboard");
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}

// O‘ng tomondan ochiladigan standart kalkulyator
let calcCurrent = '0';
let calcStored = null;
let calcOperatorValue = null;
let calcWaitingForOperand = false;
let calcMemory = 0;
let calcExpressionText = '';

function toggleCalculator(force) {
    const drawer = document.getElementById('calculatorDrawer');
    const open = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    document.getElementById('calculatorBackdrop').classList.toggle('visible', open);
    document.getElementById('calculatorToggle').classList.toggle('active', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('calculator-open', open);
}
function updateCalcDisplay() {
    document.getElementById('calcDisplay').textContent = Number(calcCurrent).toLocaleString('uz-UZ', {maximumFractionDigits: 10});
    document.getElementById('calcExpressionDisplay').textContent = calcExpressionText;
}
function calculatorDigit(digit) {
    if (calcWaitingForOperand) { calcCurrent = digit; calcWaitingForOperand = false; }
    else calcCurrent = calcCurrent === '0' ? digit : calcCurrent + digit;
    updateCalcDisplay();
}
function calculatorDecimal() {
    if (calcWaitingForOperand) { calcCurrent = '0.'; calcWaitingForOperand = false; }
    else if (!calcCurrent.includes('.')) calcCurrent += '.';
    updateCalcDisplay();
}
function calculatorOperator(op) {
    const input = Number(calcCurrent);
    if (calcOperatorValue && !calcWaitingForOperand) calculatorEquals();
    calcStored = Number(calcCurrent);
    calcOperatorValue = op;
    calcWaitingForOperand = true;
    calcExpressionText = `${calcStored} ${{'+':'+','-':'−','*':'×','/':'÷'}[op]}`;
    updateCalcDisplay();
}
function calculatorEquals() {
    if (calcOperatorValue === null || calcStored === null) return;
    const a = calcStored, b = Number(calcCurrent);
    let result;
    if (calcOperatorValue === '+') result = a + b;
    if (calcOperatorValue === '-') result = a - b;
    if (calcOperatorValue === '*') result = a * b;
    if (calcOperatorValue === '/') result = b === 0 ? NaN : a / b;
    calcExpressionText = `${a} ${{'+':'+','-':'−','*':'×','/':'÷'}[calcOperatorValue]} ${b} =`;
    calcCurrent = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : 'Xatolik';
    calcStored = null; calcOperatorValue = null; calcWaitingForOperand = true;
    updateCalcDisplay();
}
function calculatorUnary(type) {
    const n = Number(calcCurrent);
    let result = type === 'square' ? n*n : type === 'sqrt' ? Math.sqrt(n) : 1/n;
    if (!Number.isFinite(result)) { calcCurrent = 'Xatolik'; }
    else calcCurrent = String(Number(result.toPrecision(12)));
    calcExpressionText = type === 'square' ? `sqr(${n})` : type === 'sqrt' ? `√(${n})` : `1/(${n})`;
    calcWaitingForOperand = true; updateCalcDisplay();
}
function calculatorPercent() { calcCurrent = String(Number(calcCurrent) / 100); updateCalcDisplay(); }
function calculatorSign() { if (calcCurrent !== '0') calcCurrent = String(-Number(calcCurrent)); updateCalcDisplay(); }
function calculatorClearEntry() { calcCurrent = '0'; updateCalcDisplay(); }
function clearCalculator() { calcCurrent='0'; calcStored=null; calcOperatorValue=null; calcWaitingForOperand=false; calcExpressionText=''; updateCalcDisplay(); }
function calculatorBackspace() { if (calcWaitingForOperand) return; calcCurrent = calcCurrent.length > 1 ? calcCurrent.slice(0,-1) : '0'; if (calcCurrent === '-') calcCurrent='0'; updateCalcDisplay(); }
function memoryStore() { calcMemory = Number(calcCurrent) || 0; }
function memoryRecall() { calcCurrent = String(calcMemory); calcWaitingForOperand = true; updateCalcDisplay(); }
function memoryAdd() { calcMemory += Number(calcCurrent) || 0; }
function memorySubtract() { calcMemory -= Number(calcCurrent) || 0; }
function memoryClear() { calcMemory = 0; }

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') toggleCalculator(false);
    if (!document.getElementById('calculatorDrawer').classList.contains('open')) return;
    if (/^[0-9]$/.test(event.key)) calculatorDigit(event.key);
    else if (event.key === '.') calculatorDecimal();
    else if (['+','-','*','/'].includes(event.key)) calculatorOperator(event.key);
    else if (event.key === 'Enter' || event.key === '=') calculatorEquals();
    else if (event.key === 'Backspace') calculatorBackspace();
    else if (event.key === 'Escape') clearCalculator();
});
updateCalcDisplay();
