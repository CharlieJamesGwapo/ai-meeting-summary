import { jsPDF } from 'jspdf';
import { Summary } from './types';

export const exportToPDF = (summary: Summary): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 10;
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin;
  const lineHeight = 5;

  // Helper function to add text with wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    bold: boolean = false
  ): number => {
    doc.setFontSize(fontSize);
    if (bold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }

    const textLines = doc.splitTextToSize(text, maxWidth - 2 * x);
    doc.text(textLines, x, y);
    return y + textLines.length * lineHeight;
  };

  // Title
  yPosition = addWrappedText('Meeting Summary', margin, yPosition, 16, true);
  yPosition += 5;

  // Date
  const date = new Date(summary.createdAt).toLocaleString();
  yPosition = addWrappedText(`Date: ${date}`, margin, yPosition, 10);
  yPosition += 2;

  // Attendees
  if (summary.attendees.length > 0) {
    yPosition = addWrappedText(
      `Attendees: ${summary.attendees.join(', ')}`,
      margin,
      yPosition,
      10
    );
    yPosition += 2;
  }

  // Duration
  yPosition = addWrappedText(
    `Duration: ${summary.duration}`,
    margin,
    yPosition,
    10
  );
  yPosition += 5;

  // Summary
  yPosition = addWrappedText('Summary', margin, yPosition, 12, true);
  yPosition = addWrappedText(summary.summary, margin, yPosition, 10);
  yPosition += 5;

  // Key Decisions
  if (summary.keyDecisions.length > 0) {
    yPosition = addWrappedText('Key Decisions', margin, yPosition, 12, true);
    summary.keyDecisions.forEach((decision) => {
      yPosition = addWrappedText(`• ${decision}`, margin + 5, yPosition, 10);
    });
    yPosition += 3;
  }

  // Action Items
  if (summary.actionItems.length > 0) {
    yPosition = addWrappedText('Action Items', margin, yPosition, 12, true);
    summary.actionItems.forEach((item) => {
      const assignee = item.assignee ? ` (${item.assignee})` : '';
      yPosition = addWrappedText(
        `• ${item.text}${assignee}`,
        margin + 5,
        yPosition,
        10
      );
    });
    yPosition += 3;
  }

  // Topics
  if (summary.topics.length > 0) {
    yPosition = addWrappedText('Topics', margin, yPosition, 12, true);
    yPosition = addWrappedText(
      summary.topics.join(', '),
      margin + 5,
      yPosition,
      10
    );
    yPosition += 3;
  }

  // Sentiment
  yPosition = addWrappedText('Sentiment', margin, yPosition, 12, true);
  yPosition = addWrappedText(
    `Tone: ${summary.sentiment.tone} (${(
      summary.sentiment.score * 100
    ).toFixed(0)}%)`,
    margin + 5,
    yPosition,
    10
  );

  doc.save('meeting-summary.pdf');
};

export const exportToMarkdown = (summary: Summary): void => {
  const date = new Date(summary.createdAt).toLocaleString();

  let markdown = `# Meeting Summary\n\n`;
  markdown += `**Date:** ${date}\n\n`;

  if (summary.attendees.length > 0) {
    markdown += `**Attendees:** ${summary.attendees.join(', ')}\n\n`;
  }

  markdown += `**Duration:** ${summary.duration}\n\n`;

  markdown += `## Summary\n\n${summary.summary}\n\n`;

  if (summary.keyDecisions.length > 0) {
    markdown += `## Key Decisions\n\n`;
    summary.keyDecisions.forEach((decision) => {
      markdown += `- ${decision}\n`;
    });
    markdown += '\n';
  }

  if (summary.actionItems.length > 0) {
    markdown += `## Action Items\n\n`;
    summary.actionItems.forEach((item) => {
      const assignee = item.assignee ? ` (${item.assignee})` : '';
      markdown += `- [ ] ${item.text}${assignee}\n`;
    });
    markdown += '\n';
  }

  if (summary.topics.length > 0) {
    markdown += `## Topics\n\n${summary.topics.join(', ')}\n\n`;
  }

  markdown += `## Sentiment\n\n`;
  markdown += `Tone: **${summary.sentiment.tone}** (${(
    summary.sentiment.score * 100
  ).toFixed(0)}%)\n`;

  downloadFile(markdown, 'meeting-summary.md', 'text/markdown');
};

export const exportToText = (summary: Summary): void => {
  const date = new Date(summary.createdAt).toLocaleString();

  let text = `MEETING SUMMARY\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `Date: ${date}\n`;

  if (summary.attendees.length > 0) {
    text += `Attendees: ${summary.attendees.join(', ')}\n`;
  }

  text += `Duration: ${summary.duration}\n\n`;

  text += `SUMMARY\n${'-'.repeat(50)}\n${summary.summary}\n\n`;

  if (summary.keyDecisions.length > 0) {
    text += `KEY DECISIONS\n${'-'.repeat(50)}\n`;
    summary.keyDecisions.forEach((decision) => {
      text += `• ${decision}\n`;
    });
    text += '\n';
  }

  if (summary.actionItems.length > 0) {
    text += `ACTION ITEMS\n${'-'.repeat(50)}\n`;
    summary.actionItems.forEach((item) => {
      const assignee = item.assignee ? ` (${item.assignee})` : '';
      text += `• ${item.text}${assignee}\n`;
    });
    text += '\n';
  }

  if (summary.topics.length > 0) {
    text += `TOPICS\n${'-'.repeat(50)}\n${summary.topics.join(', ')}\n\n`;
  }

  text += `SENTIMENT\n${'-'.repeat(50)}\n`;
  text += `Tone: ${summary.sentiment.tone} (${(
    summary.sentiment.score * 100
  ).toFixed(0)}%)\n`;

  downloadFile(text, 'meeting-summary.txt', 'text/plain');
};

export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
