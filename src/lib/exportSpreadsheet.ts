// ===========================================================
// PeptiVA — Cycle Tracker: styled spreadsheet export
// Builds a SpreadsheetML (.xls) workbook — opens directly in
// Excel / LibreOffice with branded colours, fonts and borders.
// Zero dependencies: pure XML templating, same approach as the
// .ics calendar export. No network calls.
// ===========================================================

import { ActiveCycle, DoseLog } from "./useTracker";
import { dayIndexFor, getProtocol, getProtocolProduct, phaseForWeek } from "./protocols";
import { toDateInputValue } from "./trackerFormat";

const HEADERS = [
  "Date",
  "Time",
  "Compound",
  "Category",
  "Cycle Day",
  "Phase",
  "Dose",
  "Injection Site",
  "Notes",
];

const COLUMN_WIDTHS = [70, 60, 130, 160, 60, 85, 90, 90, 260];

/** Category -> row-tint style id, echoing the storefront's vial-cap palette. */
const CATEGORY_STYLES: Record<string, string> = {
  "Weight Management": "CatGold",
  "Growth Hormone / Fat Loss": "CatPeach",
  "Recovery / Anti-Aging": "CatMint",
  "Sexual Health": "CatRose",
  "Performance / Nootropics": "CatLavender",
};

const CATEGORY_FILLS: Record<string, string> = {
  CatGold: "#F4EBDD",
  CatPeach: "#F7E5DF",
  CatMint: "#E5EEE3",
  CatRose: "#F4DCE3",
  CatLavender: "#E9E5F2",
  CatDefault: "#F5F5F7",
};

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function strCell(styleId: string, value: string): string {
  if (value === "") return `<Cell ss:StyleID="${styleId}"/>`;
  return `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function numCell(styleId: string, value: number | null): string {
  if (value === null) return `<Cell ss:StyleID="${styleId}"/>`;
  return `<Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${value}</Data></Cell>`;
}

/** Per-category fill + a bold "phase" variant in the brand plum. */
function categoryStylesXml(): string {
  return Object.entries(CATEGORY_FILLS)
    .map(
      ([id, fill]) => `<Style ss:ID="${id}">
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#2A2530"/>
    <Interior ss:Color="${fill}" ss:Pattern="Solid"/>
    <Alignment ss:Vertical="Center"/>
    <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#ECE3E6"/></Borders>
   </Style>
   <Style ss:ID="${id}Phase">
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#7A2E55" ss:Bold="1"/>
    <Interior ss:Color="${fill}" ss:Pattern="Solid"/>
    <Alignment ss:Vertical="Center"/>
    <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#ECE3E6"/></Borders>
   </Style>`
    )
    .join("\n   ");
}

/** Build a styled .xls (SpreadsheetML) workbook of the dose log. */
export function buildLogsSpreadsheet(
  logs: DoseLog[],
  cycles: ActiveCycle[],
  generatedAt: Date
): string {
  const lastCol = HEADERS.length - 1;

  const dataRows = [...logs]
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .map((l) => {
      const product = getProtocolProduct(l.compoundId);
      const protocol = getProtocol(l.compoundId);
      const name = product?.name ?? protocol?.id ?? l.compoundId;
      const category = protocol?.category ?? "";
      const styleId = CATEGORY_STYLES[category] ?? "CatDefault";

      const d = new Date(l.datetime);
      const valid = !Number.isNaN(d.getTime());
      const date = valid ? toDateInputValue(d) : l.datetime;
      const time = valid
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

      let cycleDay: number | null = null;
      let phase = "";
      const cycle = cycles.find((c) => c.compoundId === l.compoundId);
      if (cycle && protocol && valid) {
        const dayIndex = dayIndexFor(cycle.startDate, d);
        const totalDays = protocol.cycleWeeks * 7;
        if (dayIndex >= 0 && dayIndex < totalDays) {
          cycleDay = dayIndex + 1;
          phase = phaseForWeek(protocol, Math.floor(dayIndex / 7))?.phase.name ?? "";
        }
      }

      return `<Row>
    ${strCell(styleId, date)}
    ${strCell(styleId, time)}
    ${strCell(styleId, name)}
    ${strCell(styleId, category)}
    ${numCell(styleId, cycleDay)}
    ${strCell(`${styleId}Phase`, phase)}
    ${strCell(styleId, l.dose)}
    ${strCell(styleId, l.site)}
    ${strCell(styleId, l.notes)}
   </Row>`;
    });

  const generated = escapeXml(
    generatedAt.toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Khaleej Peptides Dose Log</Title>
  <Author>Khaleej Peptides</Author>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#2A2530"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Georgia" ss:Size="18" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#121B39" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Left"/>
  </Style>
  <Style ss:ID="Subtitle">
   <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#6B6470" ss:Italic="1"/>
   <Interior ss:Color="#FBF7EE" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Left"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1B2447" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center" ss:WrapText="1"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#A9842F"/></Borders>
  </Style>
  ${categoryStylesXml()}
 </Styles>
 <Worksheet ss:Name="Dose Log">
  <Table>
   ${COLUMN_WIDTHS.map((w) => `<Column ss:Width="${w}"/>`).join("\n   ")}
   <Row ss:Height="26">
    <Cell ss:StyleID="Title" ss:MergeAcross="${lastCol}"><Data ss:Type="String">Khaleej Peptides — Cycle Tracker · Dose Log</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:StyleID="Subtitle" ss:MergeAcross="${lastCol}"><Data ss:Type="String">Generated ${generated} · Stored only on this device, no account needed</Data></Cell>
   </Row>
   <Row ss:Height="6">
    <Cell ss:StyleID="Subtitle" ss:MergeAcross="${lastCol}"/>
   </Row>
   <Row ss:Height="22">
    ${HEADERS.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("\n    ")}
   </Row>
   ${dataRows.join("\n   ")}
  </Table>
 </Worksheet>
</Workbook>`;
}

export function downloadSpreadsheet(filename: string, content: string) {
  try {
    const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    /* ignore */
  }
}
