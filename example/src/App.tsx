import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { Menu, MenuContextProvider, MenuElementProps, MenuOrigin } from "react-generic-menu";

const Button = React.forwardRef<HTMLDivElement, MenuElementProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ onExitDirection: _, ...props }, extRef) => {
    return (
      <StyledButton
        onClick={(e: any) => {
          e.stopPropagation();
          console.log("clicked")
        }}
        ref={extRef}
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
}

const ContextualMenu = ({ x, y, displayed }: ContextualMenuProps) => {
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
        selectable={[Button, SubMenuButton, SubMenu2]}
        transform={`scale(${displayed ? 1 : 0})`}
      >
        <Button>Button 1</Button>
        <Button disabled>Disabled button</Button>
        <Button>Button 2</Button>
        <SubMenuButton ref={buttonRef} onClick={() => setSubDisplayed(old => !old)}>
          Open submenu
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
        <SubMenu2 selectable={[Button]}>
          <Title>Submenu</Title>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </SubMenu2>
        pure text
        <Button>Button 4</Button>
      </StyledMenu>
    </>
  );
};

const Title = styled(StyledButton)`
  font-weight: bold;
`

const SubMenu2 = styled(Menu)`
  outline: 1px solid blue;
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

function App() {
  const [{ x, y }, setPos] = useState({ x: 0, y: 0 });
  const [displayed, setDisplayed] = useState(false);

  return (
    <Container
      onContextMenu={(e) => {
        e.preventDefault();
        setDisplayed((old) => !old);
        setPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <MenuContextProvider>
        <ContextualMenu x={x} y={y} displayed={displayed} />
      </MenuContextProvider>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default App;
