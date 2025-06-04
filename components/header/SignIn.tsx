import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
const onLoad = (containerID: string) => {
  window.STOREFRONT.USER.subscribe((sdk) => {
    const container = document.getElementById(containerID) as HTMLDivElement;
    const nodes = container.querySelectorAll<HTMLAnchorElement>("a");
    const login = nodes.item(0);
    const account = nodes.item(1);
    const user = sdk.getUser();
    if (user?.email) {
      login.classList.add("hidden");
      account.classList.remove("hidden");
    } else {
      login.classList.remove("hidden");
      account.classList.add("hidden");
    }
  });
};
function SignIn() {
  const id = useId();
  return (
    <div id={id}>
      <a
        class="flex items-center gap-2"
        href="/login"
        aria-label="Login"
      >
        <Icon id="account_circle" size={24} />
        <p class="text-sm m-0 leading-4">Faça seu <b>login</b><br />ou <b>cadastre-se</b></p>
      </a>
      <a
        class={clx(
          "hidden",
          "flex items-center gap-2"
        )}
        href="/account"
        aria-label="Account"
      >
        <Icon id="account_circle" size={24} />
        <p class="text-sm m-0 leading-4">Acesse sua conta</p>
      </a>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default SignIn;
