import ExcelJS from 'exceljs';

export async function gerarPlanilha(dados, res) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Levantamento de Gás');

  // Título
  sheet.mergeCells('A1:D1');
  sheet.getCell('A1').value = 'LEVANTAMENTO DE GÁS - EMEB\'S E CEMEI\'S';
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getRow(1).font = { bold: true, size: 14 };

  // Data e Local
  sheet.mergeCells('A2:D2');
  sheet.getCell('A2').value = `DATA: ${dados.data} - MERENDA VALINHOS/SP`;
  sheet.getCell('A2').alignment = { horizontal: 'center' };

  // Rota e Nutricionista
  sheet.mergeCells('A3:D3');
  sheet.getCell('A3').value = `ROTA ${dados.rota} - NUTRICIONISTA: ${dados.nutricionista}`;
  sheet.getCell('A3').alignment = { horizontal: 'center' };

  // Linha em branco
  sheet.addRow([]);

  // Cabeçalho da tabela
  const cabecalho = ['UNIDADES ESCOLARES', 'CILINDROS P45', 'P13'];
  const headerRow = sheet.addRow(cabecalho);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDDDDDD' },
  };

  // Dados das escolas
  dados.escolas.forEach((escola) => {
    sheet.addRow([
      `${escola.id} - ${escola.nome}`,
      escola.p45 || 0,
      escola.p13 || 0,
    ]);
  });

  // Ajustar largura das colunas
  sheet.columns = [
    { width: 40 },
    { width: 15 },
    { width: 15 },
  ];

  // Enviar a planilha como download
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=levantamento_gas.xlsx'
  );

  await workbook.xlsx.write(res);
  res.end();
}
