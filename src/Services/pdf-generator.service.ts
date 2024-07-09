import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generatePdfFromTableRow(rowElement: HTMLElement) {
    const pdf = new jspdf.jsPDF();

    html2canvas(rowElement).then((canvas) => {
   
      console.log(   rowElement.innerText)
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('table_row_data.pdf');
    });
  }
}
