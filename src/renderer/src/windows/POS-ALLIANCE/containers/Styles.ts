import styled from 'styled-components'
export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width:100vw;
    height:calc(100vh - 3rem);
`
export const Card = styled.div`
    width: 100%;
    height:100%;
    border-radius: 8px;
    display:flex;
    padding:10px;
    flex-direction: column;
`
export const Title = styled.h2`
    margin-bottom: 30px;
    padding:10px;
    text-align: center;
`
export const Item = styled.div`
    margin-bottom: 10px;
`