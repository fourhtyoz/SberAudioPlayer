import React from "react"
import styled from "styled-components"

const SAnimation = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 4px;
    position: relative;
    right: 15px;
    top: -10px;
    margin-right: 9px;
`

const Bar = styled.div`
    width: 5px;
    height: 20px;
    background-color: #4caf50;
    animation: bounce 0.5s ease infinite alternate;
    border-radius: 2px; 
`

export default function AudioAnimation() {
    return (
        <SAnimation className="audio-visualizer" title="Воспроизводится">
            <Bar className="bar"></Bar>
            <Bar className="bar"></Bar>
            <Bar className="bar"></Bar>
            <Bar className="bar"></Bar>
            <Bar className="bar"></Bar>
        </SAnimation>

    )
}