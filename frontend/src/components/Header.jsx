import React from "react"
import styled from "styled-components";
import Navbar from "./Navbar";

const SHeader = styled.header`
    border: 1px solid #ececec;
    // height: 200px;
    padding: 1em;
    display: flex;
    justify-content: space-between;
`

const STitle = styled.h1`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function Header() {
    return (
        <SHeader>
            <STitle>Тестовое задание в Robotics Center [Fullstack developer]</STitle>
            <Navbar />
        </SHeader>
    )    
}