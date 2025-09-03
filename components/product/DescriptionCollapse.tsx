import { useState } from "preact/hooks";

interface DescriptionCollapseProps {
  preview: string;
  rest: string;
}

export default function DescriptionCollapse(
  { preview, rest }: DescriptionCollapseProps,
) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div class="fluid-text text-sm">
      {!expanded
        ? (
          <>
            <span dangerouslySetInnerHTML={{ __html: preview }} />...{" "}
            <button
              class="link-btn ml-2"
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
                fontSize: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setExpanded(true)}
            >
              Ver mais
            </button>
          </>
        )
        : (
          <>
            <span dangerouslySetInnerHTML={{ __html: preview + rest }} />
            <button
              class="link-btn ml-2"
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
                fontSize: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                marginTop: "8px",
              }}
              onClick={() => setExpanded(false)}
            >
              Ver menos
            </button>
          </>
        )}
    </div>
  );
}
