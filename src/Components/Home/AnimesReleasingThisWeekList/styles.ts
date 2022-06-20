import styled from 'styled-components'

interface itemData {
    info: any
}

export const AnimeToBeListed = styled.div<itemData>`

    height: 28rem;
    width: 20rem;

    margin: 0 0.7rem;

    @media(max-width: 520px){
        margin: 0 0.3rem;
    }

    background-image: ${(props) => props.info.coverImage && `url("${props.info.coverImage.large}")`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    border-radius: 2px;

    div.add-button{

        height: 50%;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;

        button{
            cursor: pointer;

            padding: 0.5rem;
            margin: 1rem;

            border: none;
            outline: 0;

            background-color: #8d8d8dc9;

            svg{
                color: #fff;

                height: 2.5rem;
                width: auto;
            }

            :hover{
                opacity: 0.9;
            }
        }

    }

    :hover{
            
            
            .see-more-button{
                background-image: linear-gradient(rgba(0,0,0,.01) , rgba(0,0,0,.8) 20%);

            .name-fade{
                opacity: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                width: 90%;

                transition: all ease-in-out 200ms;
                
                font-size: 1.4rem;
                font-weight: 600;
                color: #c0c0c0;
                /* color:  ${props => props.info.coverImage.color}; */

            }
        }
    }

    div.see-more-button{

        height: 50%;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        align-items: center;

        .name-fade{
            transition: all ease-in-out 200ms;
            opacity: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;


            margin-top: 10%;
            
            display: flex;
            justify-content: center;
            align-items: center;

            width: 90%;

            transition: all ease-in-out 200ms;
                
            h1{
                font-size: 1.4rem;
                font-weight: 600;
                color: #c0c0c0;
            }
        }

        a{
            width: 75%;

            margin: 1.5rem 0;
            padding: 1rem;
            
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: #ff1a75;

            color: #fff;
            font-size: 1.4rem;
            font-weight: 400;
            
            :hover{
                opacity: 0.9;
            }
        }

    }



`