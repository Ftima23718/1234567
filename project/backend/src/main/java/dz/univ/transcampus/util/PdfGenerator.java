package dz.univ.transcampus.util;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Component
public class PdfGenerator {

    public byte[] generateBadgePdf(String etudiantNom, String etudiantPrenom, String ligneNom,
                                    String typeAbonnement, String dateExpiration, String qrCodeBase64) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("TRANSCAMPUS - Badge Transport")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("\n"));

        Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .useAllAvailableWidth();

        table.addCell("Nom");
        table.addCell(etudiantNom);
        table.addCell("Prénom");
        table.addCell(etudiantPrenom);
        table.addCell("Ligne");
        table.addCell(ligneNom != null ? ligneNom : "N/A");
        table.addCell("Abonnement");
        table.addCell(typeAbonnement != null ? typeAbonnement : "N/A");
        table.addCell("Expiration");
        table.addCell(dateExpiration != null ? dateExpiration : "N/A");

        document.add(table);

        if (qrCodeBase64 != null) {
            try {
                byte[] qrBytes = Base64.getDecoder().decode(qrCodeBase64);
                ImageData imageData = ImageDataFactory.create(qrBytes);
                Image qrImage = new Image(imageData).setWidth(150).setHeight(150);
                qrImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(new Paragraph("\nQR Code :").setTextAlignment(TextAlignment.CENTER));
                document.add(qrImage);
            } catch (Exception e) {
                document.add(new Paragraph("QR Code non disponible"));
            }
        }

        document.add(new Paragraph("\nGénéré le " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER));

        document.close();
        return baos.toByteArray();
    }

    public byte[] generateInscriptionsPdf(java.util.List<String[]> rows, String[] headers) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("TRANSCAMPUS - Liste des Inscriptions")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("\n"));

        float[] widths = new float[headers.length];
        for (int i = 0; i < widths.length; i++) widths[i] = 100f / headers.length;

        Table table = new Table(UnitValue.createPercentArray(widths)).useAllAvailableWidth();

        for (String header : headers) {
            table.addHeaderCell(new Paragraph(header).setBold());
        }

        for (String[] row : rows) {
            for (String cell : row) {
                table.addCell(cell != null ? cell : "");
            }
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }
}
