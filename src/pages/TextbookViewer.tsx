import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TextbookViewer = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = params.get("url") || "";
  const title = params.get("title") || "Textbook";

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 font-heading text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="flex-1 truncate font-heading text-sm font-semibold text-foreground">
          📖 {title}
        </h1>
      </div>

      {url ? (
        <iframe
          src={url}
          title={title}
          className="flex-1 w-full border-0"
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-md rounded-xl border bg-card p-6 shadow-sm">
            <p className="font-heading text-base font-semibold text-foreground">No textbook URL provided</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please go back and select a textbook to view.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbookViewer;
