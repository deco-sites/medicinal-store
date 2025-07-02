import { useScript } from "@deco/deco/hooks";

interface Props {
  id: string;
}

export default function ({
  id,
}: Props) {
  return (
    <div class="w-full p-4 container mx-auto">
      <div role="main" id={id} />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: useScript((id) => {
            // @ts-ignore RDStationForms is defined
            new RDStationForms(id, "UA-114525647-1").createForm();
          }, id),
        }}
      />
    </div>
  );
}
