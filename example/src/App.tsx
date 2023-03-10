import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { Menu, MenuContextProvider, MenuElementProps, MenuOrigin } from "react-generic-menu";

const Button = React.forwardRef<HTMLDivElement, MenuElementProps>(
  (props, extRef) => {
    return (
      <StyledButton
        onClick={(e: any) => {
          e.stopPropagation();
          console.log("clicked")
        }}
        ref={extRef}
        {...props}
      >
        Button
      </StyledButton>
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

  useEffect(() => {
    console.log(buttonRef);
  }, [buttonRef]);

  return (
    <StyledMenu
      x={x}
      y={y}
      displayed={displayed}
      resetIndex
      origin="top-center"
      infiniteNavigation
      selectable={[Button, SubMenu]}
      transform={`scale(${displayed ? 1 : 0})`}
    >
      <Button />
      <Button />
      <Button disabled />
      oui
      <Button ref={buttonRef} />

      <SubMenu resetIndex selectable={[Button]}>
        <Button />
        <Button />
      </SubMenu>

      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
    </StyledMenu>
  );
};

const SubMenu = styled(Menu)`
  border: 1px solid blue;
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
  const [displayed2, setDisplayed2] = useState(false);

  return (
    <Container
      onClick={() => {
        setDisplayed2((old) => !old);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setDisplayed((old) => !old);
        setPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <MenuContextProvider>
        <ContextualMenu x={x} y={y} displayed={displayed} />
        {/* <ContextualMenu x={x + 100} y={y + 100} displayed={displayed2} /> */}
      </MenuContextProvider>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default App;
