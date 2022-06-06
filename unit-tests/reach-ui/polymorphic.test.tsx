import * as React from "react";
import { render } from "@testing-library/react";
import type * as Polymorphic from "@reach/utils/polymorphic";
import type { RenderResult } from "@testing-library/react";
import { Link as RouterLink, BrowserRouter } from "react-router-dom";

interface ButtonProps {
  isDisabled?: boolean;
  another?: number;
}

const Button = React.forwardRef((props, forwardedRef) => {
  const { as: Comp = "button", isDisabled, ...buttonProps } = props;
  return <Comp {...buttonProps} ref={forwardedRef} />;
}) as Polymorphic.ForwardRefComponent<"button", ButtonProps>;

const MemoedButton = React.memo(Button) as Polymorphic.MemoComponent<
  "button",
  ButtonProps
>;

const ExtendedButtonUsingReactUtils = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>((props, forwardedRef) => {
  return <Button {...props} ref={forwardedRef} />;
});

export function ExtendedButtonUsingReactUtilsWithInternalInlineAs(
  props: React.ComponentProps<typeof Button>
) {
  /* Should not error with inline `as` component */
  return <Button as={(props: any) => <button {...props} />} {...props} />;
}

interface ExtendedButtonProps {
  isExtended?: boolean;
}

type ExtendedButtonButtonOwnProps = Omit<
  Polymorphic.OwnProps<typeof Button>,
  keyof ExtendedButtonProps | "another"
>;

const ExtendedButton = React.forwardRef((props, forwardedRef) => {
  const { isExtended, ...extendedButtonProps } = props;
  return <Button {...extendedButtonProps} ref={forwardedRef} />;
}) as Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Button>,
  ExtendedButtonProps & ExtendedButtonButtonOwnProps
>;

type LinkProps = React.ComponentPropsWithRef<"a"> & {
  isPrimary?: boolean;
  onToggle?(open: boolean): void;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { children, isPrimary, ...linkProps } = props;
  return (
    <a className={isPrimary ? "primary" : undefined} ref={ref} {...linkProps}>
      {children}
    </a>
  );
});

interface AnchorProps {
  requiredProp: boolean;
}

const Anchor = React.forwardRef((props, forwardedRef) => {
  const { as: Comp = "a", requiredProp, ...anchorProps } = props;
  /* Does not expect requiredProp */
  return <Comp {...anchorProps} ref={forwardedRef} />;
}) as Polymorphic.ForwardRefComponent<"a", AnchorProps>;

////////////////////////////////////////////////////////////////////////////////

export function Test() {
  const buttonRef = React.useRef<React.ElementRef<typeof Button>>(null);
  const buttonAsDivRef = React.useRef<HTMLDivElement>(null);
  const buttonAsLinkRef = React.useRef<React.ElementRef<typeof Link>>(null);

  return (
    <BrowserRouter>
      {/* Button accepts ref */}
      <Button ref={buttonRef} />

      {/* Button as "div" accepts ref */}
      <Button as="div" ref={buttonAsDivRef} />

      {/* Button as Link accepts ref */}
      <Button as={Link} ref={buttonAsLinkRef} />

      {/* Memoized button accepts ref */}
      <MemoedButton ref={buttonRef} />

      {/* Memoized button as "div" accepts ref */}
      <MemoedButton as="div" ref={buttonAsDivRef} />

      {/* Memoized button as Link accepts ref */}
      <MemoedButton as={Link} ref={buttonAsLinkRef} />

      {/* Link accepts onToggle prop */}
      <Link onToggle={(open) => console.log(open)} />

      {/* Link accepts isPrimary prop */}
      <Link isPrimary />

      {/* Button does not accept href prop */}
      {/* @ts-expect-error */}
      <Button href="#" />

      {/* Memoized button does not accept href prop */}
      {/* @ts-expect-error */}
      <MemoedButton href="#" />

      {/* Button accepts form prop */}
      <Button form="form" />

      {/* Button accepts isDisabled prop */}
      <Button isDisabled />

      {/* Button as "a" accepts href prop */}
      <Button as="a" href="#" />

      {/* Button as "a" does not accept form prop */}
      {/* @ts-expect-error */}
      <Button as="a" form="form" />

      {/* Memoized button as "a" does not accept form prop */}
      {/* @ts-expect-error */}
      <MemoedButton as="a" form="form" />

      {/* Button as RouterLink accepts to prop */}
      <Button as={RouterLink} to="/route" />

      {/* Button as Link accepts href prop */}
      <Button as={Link} href="#" />

      {/* Button as Link accepts isPrimary prop */}
      <Button as={Link} isPrimary />

      {/* Button as Link accepts isDisabled prop */}
      <Button as={Link} />

      {/* Button as Link does not accept form prop */}
      {/* @ts-expect-error */}
      <Button as={Link} form="form" />

      {/* Button accepts onClick prop */}
      <Button onClick={(event) => event.currentTarget.form} />

      {/* Button as "a" accepts onClick prop */}
      <Button as="a" onClick={(event) => event.currentTarget.href} />

      {/* Button as Link accepts onClick prop, but it must be explicitly typed */}
      <Button
        as={Link}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
          event.altKey
        }
      />

      {/* ExtendedButton accepts isExtended prop */}
      <ExtendedButton isExtended />

      {/* ExtendedButton accepts isDisabled prop */}
      <ExtendedButton isDisabled />

      {/* ExtendedButton does not accept another prop */}
      {/* @ts-expect-error */}
      <ExtendedButton another={1} />

      {/* ExtendedButton accepts onClick prop */}
      <ExtendedButton onClick={(event) => event.currentTarget.form} />

      {/* ExtendedButton as "a" accepts isExtended prop */}
      <ExtendedButton as="a" isExtended />

      {/* ExtendedButton as "a" accepts isDisabled prop */}
      <ExtendedButton as="a" isDisabled />

      {/* ExtendedButton as "a" accepts onClick prop */}
      <ExtendedButton as="a" onClick={(event) => event.currentTarget.href} />

      {/* ExtendedButtonUsingReactUtils accepts isDisabled prop */}
      <ExtendedButtonUsingReactUtils isDisabled />

      {/* ExtendedButtonUsingReactUtils accepts onClick prop */}
      <ExtendedButtonUsingReactUtils
        onClick={(event) => event.currentTarget.form}
      />

      {/* ExtendedButtonUsingReactUtils does not accept as prop */}
      {/* @ts-expect-error */}
      <ExtendedButtonUsingReactUtils as="a" isDisabled />

      {/* Anchor expects requiredProp prop */}
      {/* @ts-expect-error */}
      <Anchor />

      {/* Button as Anchor (Polymorphic.ForwardRefComponent) expects required prop */}
      {/* @ts-expect-error */}
      <Button as={Anchor} />

      {/* Button as Anchor (Polymorphic.ForwardRefComponent) accepts requiredProp */}
      <Button as={Anchor} requiredProp />
    </BrowserRouter>
  );
}

describe("Given polymorphic forwardRef components", () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Test />);
  });

  it("should render", async () => {
    expect(rendered.container.firstChild).toBeInTheDocument();
  });
});
