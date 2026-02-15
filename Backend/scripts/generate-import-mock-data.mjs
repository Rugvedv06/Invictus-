import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const outputDir = path.resolve('mock-data', 'import');
fs.mkdirSync(outputDir, { recursive: true });

for (const existing of fs.readdirSync(outputDir)) {
  if (existing.endsWith('.xlsx')) {
    fs.unlinkSync(path.join(outputDir, existing));
  }
}

const writeWorkbook = (rows, sheetName, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const filePath = path.join(outputDir, fileName);
  XLSX.writeFile(workbook, filePath);
  return filePath;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildComponentsData = (count = 180) => {
  const categories = [
    {
      code: 'CAP',
      names: ['Capacitor Ceramic', 'Capacitor Electrolytic', 'Capacitor Tantalum'],
      unit: 'pcs',
      stockRange: [300, 6000],
      monthlyRange: [250, 3000],
    },
    {
      code: 'RES',
      names: ['Resistor 1/4W', 'Resistor 1/8W', 'Precision Resistor'],
      unit: 'pcs',
      stockRange: [500, 9000],
      monthlyRange: [300, 5000],
    },
    {
      code: 'IC',
      names: ['Microcontroller IC', 'Op-Amp IC', 'Logic IC'],
      unit: 'pcs',
      stockRange: [80, 1200],
      monthlyRange: [60, 800],
    },
    {
      code: 'CON',
      names: ['Board Connector', 'Pin Header', 'Terminal Block'],
      unit: 'pcs',
      stockRange: [120, 2500],
      monthlyRange: [80, 1300],
    },
    {
      code: 'REG',
      names: ['Voltage Regulator', 'Buck Converter IC', 'LDO Regulator'],
      unit: 'pcs',
      stockRange: [60, 1000],
      monthlyRange: [40, 700],
    },
    {
      code: 'SEN',
      names: ['Temperature Sensor', 'Current Sensor', 'Motion Sensor'],
      unit: 'pcs',
      stockRange: [40, 800],
      monthlyRange: [30, 600],
    },
  ];

  const rows = [];
  for (let i = 1; i <= count; i += 1) {
    const category = categories[(i - 1) % categories.length];
    const name = category.names[(i - 1) % category.names.length];

    const stock = randomInt(category.stockRange[0], category.stockRange[1]);
    const monthlyRequired = randomInt(category.monthlyRange[0], category.monthlyRange[1]);

    rows.push({
      'Component Name': `${name} ${String(i).padStart(3, '0')}`,
      'Part Number': `${category.code}-${String(i).padStart(4, '0')}`,
      'Current Stock Quantity': stock,
      'Monthly Required Quantity': monthlyRequired,
      Description: `Auto-generated ${name.toLowerCase()} for import testing`,
      'Unit of Measurement': category.unit,
    });
  }

  return rows;
};

const buildPcbMasterBomData = (componentsRows, pcbCount = 60) => {
  const partNumbers = componentsRows.map((row) => row['Part Number']);
  const rows = [];

  for (let i = 1; i <= pcbCount; i += 1) {
    const pcbCode = `PCB-${String(i).padStart(4, '0')}`;
    const pcbName = `InventoryX PCB ${String(i).padStart(3, '0')}`;
    const mappingsCount = randomInt(4, 8);
    const usedPartNumbers = new Set();

    for (let j = 0; j < mappingsCount; j += 1) {
      const candidateIndex = ((i - 1) * 7 + j * 13) % partNumbers.length;
      let partNumber = partNumbers[candidateIndex];

      if (usedPartNumbers.has(partNumber)) {
        partNumber = partNumbers[(candidateIndex + j + 3) % partNumbers.length];
      }

      usedPartNumbers.add(partNumber);

      rows.push({
        'PCB Code': pcbCode,
        'PCB Name': pcbName,
        'PCB Description': `Auto-generated PCB master for import testing (${pcbCode})`,
        Version: `V${randomInt(1, 4)}.0`,
        'Is Active': true,
        'Component Part Number': partNumber,
        'Quantity Per PCB': randomInt(1, 6),
        'BOM Notes': 'Auto-generated BOM mapping row',
      });
    }
  }

  return rows;
};

const buildPcbProductionData = (pcbMasterBomRows, componentsRows, count = 140) => {
  const rows = [];
  const componentStockMap = new Map(
    componentsRows.map((row) => [row['Part Number'], Number(row['Current Stock Quantity'] || 0)])
  );

  const bomByPcbCode = new Map();
  for (const row of pcbMasterBomRows) {
    const pcbCode = String(row['PCB Code']).trim();
    const partNumber = String(row['Component Part Number']).trim();
    const qty = Number(row['Quantity Per PCB'] || 0);
    if (!pcbCode || !partNumber || qty <= 0) continue;

    const bomList = bomByPcbCode.get(pcbCode) || [];
    bomList.push({ partNumber, qtyPerPcb: qty });
    bomByPcbCode.set(pcbCode, bomList);
  }

  const pcbCodes = Array.from(bomByPcbCode.keys());
  const today = new Date();

  for (let i = 1; i <= count; i += 1) {
    const code = pcbCodes[(i - 1) % pcbCodes.length];
    const bomList = bomByPcbCode.get(code) || [];

    if (!bomList.length) {
      continue;
    }

    let maxProducible = Infinity;
    for (const bom of bomList) {
      const stock = Number(componentStockMap.get(bom.partNumber) || 0);
      const possible = Math.floor(stock / bom.qtyPerPcb);
      maxProducible = Math.min(maxProducible, possible);
    }

    if (!Number.isFinite(maxProducible) || maxProducible <= 0) {
      continue;
    }

    const safeUpperBound = Math.max(Math.min(maxProducible, 8), 1);
    const quantityProduced = randomInt(1, safeUpperBound);

    for (const bom of bomList) {
      const currentStock = Number(componentStockMap.get(bom.partNumber) || 0);
      componentStockMap.set(bom.partNumber, currentStock - bom.qtyPerPcb * quantityProduced);
    }

    const daysBack = randomInt(1, 90);
    const prodDate = new Date(today);
    prodDate.setDate(today.getDate() - daysBack);

    rows.push({
      'PCB Code': code,
      'Quantity Produced': quantityProduced,
      'Production Date': prodDate.toISOString().slice(0, 10),
      'Batch Number': `BATCH-INVX-${String(i).padStart(5, '0')}`,
      'DC Number': `DC-${String(3000 + i).padStart(5, '0')}`,
      Location: ['Line A', 'Line B', 'Line C'][(i - 1) % 3],
      Status: 'completed',
      Notes: 'Auto-generated valid production import row',
    });
  }

  return rows;
};

const run = async () => {
  const componentsRows = buildComponentsData(180);
  const pcbMasterBomRows = buildPcbMasterBomData(componentsRows, 60);
  const productionRows = buildPcbProductionData(pcbMasterBomRows, componentsRows, 140);

  const files = [
    writeWorkbook(componentsRows, 'Components Import', 'components_import.xlsx'),
    writeWorkbook(pcbMasterBomRows, 'PCB Master BOM Import', 'pcb_master_bom_import.xlsx'),
    writeWorkbook(productionRows, 'PCB Production Import', 'pcb_production_import.xlsx'),
  ];

  console.log('Generated import mock data files:');
  files.forEach((file) => console.log(`- ${file}`));
  console.log(`Components rows: ${componentsRows.length}`);
  console.log(`PCB master + BOM rows: ${pcbMasterBomRows.length}`);
  console.log(`PCB production rows: ${productionRows.length}`);
};

run().catch((error) => {
  console.error('Failed to generate mock data:', error.message);
  process.exit(1);
});
