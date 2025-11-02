"use client";
import React, { useState } from "react";

export default function TranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<{ word: string; translation: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("يرجى اختيار ملف PDF أولاً!");
    setLoading(true);
    setData([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://trans-api-eight.vercel.app/translate", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setData(result.words);
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالخادم 😞");
    } finally {
      setLoading(false);
    }
  };
const exportToExcel = () => {
  // تقسيم البيانات إلى 3 أعمدة (كل عمود فيه كلمة وترجمتها)
  const chunkSize = Math.ceil(data.length / 3);
  const columns: string[][] = [];

  for (let i = 0; i < 3; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    columns.push(chunk.map((d) => `${d.word},${d.translation}`));
  }

  // إعادة تجميع الأعمدة في صفوف متوازية
  const rows: string[] = [];
  const maxRows = Math.max(...columns.map((c) => c.length));
  for (let i = 0; i < maxRows; i++) {
    const row = [
      columns[0][i] || ",",
      columns[1][i] || ",",
      columns[2][i] || ",",
    ].join(",");
    rows.push(row);
  }

  // ✅ إضافة BOM (Byte Order Mark) لحل مشكلة اللغة العربية في Excel
  const csvContent =
    "\uFEFF" +
    [
      "Word,Translation,Word,Translation,Word,Translation",
      ...rows,
    ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "translations.csv";
  link.click();
};

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📘 ترجمة كلمات PDF إلى العربية
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 text-gray-700"
        />

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "جارٍ الترجمة..." : "ترجمة الملف"}
          </button>

          {data.length > 0 && (
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              تحميل كـ Excel
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {data.length > 0 && (
          <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg mt-6">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-blue-100">
                <tr>
                  <th className="border p-2 w-1/2">English Word</th>
                  <th className="border p-2 w-1/2">Arabic Translation</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <td className="border p-2">{item.word}</td>
                    <td className="border p-2">{item.translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
