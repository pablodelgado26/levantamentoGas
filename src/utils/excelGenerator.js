import xl from 'excel4node';

export async function gerarPlanilhaExcel(dados_para_planilha) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Levantamento de Gás');

    const titleStyle = wb.createStyle({
        font: { bold: true, color: '#000000', size: 16 },
        alignment: { horizontal: 'center', vertical: 'center' }
    });

    ws.cell(1, 1, 1, 3, true).string('LEVANTAMENTO DE GÁS - ESCOLAS').style(titleStyle);

    const headerStyle = wb.createStyle({
        font: { bold: true, size: 12 },
        fill: { type: 'pattern', patternType: 'solid', fgColor: '#DDDDDD' },
        alignment: { horizontal: 'center' },
        border: {
            left: { style: 'thin' }, right: { style: 'thin' },
            top: { style: 'thin' }, bottom: { style: 'thin' }
        }
    });

    ['Unidades Escolares', 'Cilindros P45', 'P13'].forEach((heading, i) => {
        ws.cell(3, i + 1).string(heading).style(headerStyle);
    });

    const dataStyle = wb.createStyle({
        border: {
            left: { style: 'thin' }, right: { style: 'thin' },
            top: { style: 'thin' }, bottom: { style: 'thin' }
        }
    });

    let rowIndex = 4;
    let totalP45 = 0;

    dados_para_planilha.forEach(record => {
        const escolaNome = record.user?.userName || record.userName || record.nome || record.gasTipo || '';
        ws.cell(rowIndex, 1).string(String(escolaNome)).style(dataStyle);

        let valorP45 = 0;
        if (typeof record.gasPrecisa === 'boolean') {
            valorP45 = record.gasPrecisa ? 1 : 0;
        } else if (typeof record.p45 === 'number') {
            valorP45 = record.p45;
        }

        totalP45 += typeof valorP45 === 'number' ? valorP45 : 0;
        ws.cell(rowIndex, 2).number(valorP45).style(dataStyle);

        ws.cell(rowIndex, 3).number(record.p13 || 0).style(dataStyle);
        rowIndex++;
    });


    const totalStyle = wb.createStyle({
        font: { bold: true },
        fill: { type: 'pattern', patternType: 'solid', fgColor: '#F0F0F0' },
        border: {
            left: { style: 'thin' }, right: { style: 'thin' },
            top: { style: 'thin' }, bottom: { style: 'thin' }
        },
        alignment: { horizontal: 'center' }
    });

    ws.cell(rowIndex, 1).string('TOTAL').style(totalStyle);
    ws.cell(rowIndex, 2).number(totalP45).style(totalStyle);
    ws.cell(rowIndex, 3).number(0).style(totalStyle);

    ws.column(1).setWidth(40);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(15);

    return wb;
}
