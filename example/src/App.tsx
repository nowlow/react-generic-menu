import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { Menu, MenuContextProvider, MenuElementProps, MenuOrigin } from "react-generic-menu";
import useMergedRef from "@react-hook/merged-ref";

const Button = React.forwardRef<HTMLDivElement, MenuElementProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ onExitDirection: _, parentUUID: __, ...props }, extRef) => {
    const ref = useRef<HTMLDivElement>(null);
    const refs = useMergedRef(extRef, ref);

    useEffect(() => {
      if (props.selected) {
        const button = ref.current;

        if (!button) return;

        button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }, [props.selected]);

    return (
      <StyledButton
        onClick={(e: any) => {
          e.stopPropagation();
          console.log("clicked")
        }}
        ref={refs}
        {...props}
      />
    );
  }
);

const StyledButton = styled.div<MenuElementProps>`
  padding: 5px 15px;
  outline: 1px solid ${({ selected }) => (selected ? "red" : "transparent")};
  background-color: ${({ disabled }) => (disabled ? "#ececec" : "initial")};
  user-select: none;
`;

interface ContextualMenuProps {
  x: number;
  y: number;
  displayed: boolean;
  setDisplayed?: (displayed: boolean) => void;
}

const ContextualMenu = ({ x, y, displayed, setDisplayed }: ContextualMenuProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [subDisplyed, setSubDisplayed] = useState(false);

  useEffect(() => {
    console.log(buttonRef);
  }, [buttonRef]);

  useEffect(() => {
    if (!displayed) {
      setSubDisplayed(false);
    }
  }, [displayed])

  return (
    <>
      <StyledMenu
        x={x}
        y={y}
        displayed={displayed}
        resetIndex
        origin="top-center"
        infiniteNavigation
        selectable={[Button, SubMenuButton, ScrollableSubMenu]}
        transform={`scale(${displayed ? 1 : 0})`}
        onEscape={() => setDisplayed?.(false)}
      >
        <Button>Button 1</Button>
        <Button disabled>Disabled button</Button>
        <Button>Button 2</Button>
        <SubMenuButton ref={buttonRef} onClick={() => setSubDisplayed(old => !old)}>
          Open submenu →
          <SubMenu
            infiniteNavigation
            origin={'top-left'}
            resetIndex
            selectable={[Button]}
            transform={`scale(${subDisplyed ? 1 : 0})`}
            displayed={subDisplyed}
            defaultIndex={0}
            onExitDirection={(direction) => {
              if (direction === 'left') {
                setSubDisplayed(false);
              }
            }}
          >
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <Button disabled>Button 3</Button>
            <Button>Button 4</Button>
          </SubMenu>
        </SubMenuButton>
        <Button>Button 3</Button>
        <ScrollableSubMenu selectable={[Button]}>
          <Title>Scrollable submenu</Title>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
          <Button>Button 4</Button>
          <Button>Button 5</Button>
          <Button>Button 6</Button>
        </ScrollableSubMenu>
        pure text
        <Button>Button 4</Button>
      </StyledMenu>
    </>
  );
};

const Title = styled(StyledButton)`
  font-weight: bold;
`

const ScrollableSubMenu = styled(Menu)`
  outline: 1px solid blue;
  overflow-y: scroll;
  height: 100px;
`

const SubMenu = styled(Menu)<{ origin: MenuOrigin }>`
  position: absolute;
  top: 0;
  left: 100%;
  outline: 1px solid black;
  transform-origin: ${({ origin }) => origin.split("-").join(" ")};
  transition: 0.1s transform;
  background-color: white;
  width: max-content;
`

const SubMenuButton = styled(Button)`
  position: relative;
`

const StyledMenu = styled(Menu)<ContextualMenuProps & { origin: MenuOrigin }>`
  position: absolute;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  background-color: white;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  transform-origin: ${({ origin }) => origin.split("-").join(" ")};
  transition: 0.1s transform;
`;

function ValidationModal() {
  return <StyledValidationMenu origin='center-center' selectable={[ValidationButtons]} displayed>
    {/* <ValidationBody>
      Are you sure you want to do this action?
    </ValidationBody> */}
    <ValidationButtons defaultIndex={1} infiniteNavigation selectable={[Button]}>
      <Button>Yes</Button>
      <Button>No</Button>
      <Button>Maybe</Button>
      <Button>No wayyy girrl</Button>
      {/* <ValidationButtons defaultIndex={0} selectable={[Button]}>
        <Button>Yes</Button>
        <Button>No</Button>
      </ValidationButtons> */}
    </ValidationButtons>
    <ValidationButtons selectable={[Button]}>
      <Button>Yes</Button>
      <Button>No</Button>
      <Button>Maybe</Button>
      <Button>No wayyy girrl</Button>
      {/* <ValidationButtons defaultIndex={0} selectable={[Button]}>
        <Button>Yes</Button>
        <Button>No</Button>
      </ValidationButtons> */}
    </ValidationButtons>
  </StyledValidationMenu>
}

const StyledValidationMenu = styled(Menu)`
  position: absolute;
  top: 50vh;
  left: 50vw;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`
const ValidationBody = styled(Button)`
  padding: 25px;
  flex: 1;
`
const ValidationButtons = styled(Menu)<MenuElementProps>`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  outline: 1px solid ${({ selected }) => selected ? 'blue' : 'transparent'};
`

function App() {
  const [{ x, y }, setPos] = useState({ x: 0, y: 0 });
  const [displayed, setDisplayed] = useState(false);

  return (
    <Container
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;

        e.preventDefault();
        setDisplayed(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setDisplayed(true);
        setPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <MenuContextProvider>
        {/* <ValidationModal /> */}
        <ContextualMenu x={x} y={y} displayed={displayed} setDisplayed={setDisplayed} />
      </MenuContextProvider>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default App;
