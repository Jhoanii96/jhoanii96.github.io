function main(workbook: ExcelScript.Workbook): string {

  let sb: string[] = [];

  workbook.getWorksheets().forEach(sheet => {

    sb.push(`=== SHEET: ${sheet.getName()} ===`);

    const range = sheet.getUsedRange();
    if (!range) {
      sb.push("(Empty sheet)");
      sb.push("");
      return;
    }

    const values = range.getValues();

    values.forEach(row => {
      const rowValues = row.map(cell => {
        if (cell === null || cell === undefined) return "";
        return cell
          .toString()
          .replace(/\t/g, " ")
          .replace(/\r?\n/g, " ");
      });

      sb.push(rowValues.join("\t"));
    });

    sb.push(""); // spacer between sheets
  });

  return sb.join("\n");
}