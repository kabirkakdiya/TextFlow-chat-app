import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { gray } from "../../constants/colour";

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline:none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${gray}
`
export { InputBox, Link };
