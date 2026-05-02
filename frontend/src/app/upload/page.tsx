import SyllabusUploader from "@/components/upload/SyllabusUploader";

export const metadata = {
  title: "Upload Syllabus — Curriculign",
  description:
    "Upload a PDF syllabus or lesson plan and let AI agents map your CLOs to accreditation standards.",
};

export default function UploadPage() {
  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Upload a Document</h1>
        <p className="mt-2 text-slate-600">
          Drag and drop a PDF, Markdown, or plain-text syllabus or lesson plan.
          The AI pipeline will extract CLOs and map them to your chosen accreditation
          framework in seconds.
        </p>
      </div>
      <SyllabusUploader />
    </div>
  );
}
