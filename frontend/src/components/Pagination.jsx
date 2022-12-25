import React, { useEffect, useState } from 'react'
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi'
import './../style.css';

export const Pagination = (props) => {

    const [pages, setPages] = useState([]);

    useEffect(() => {
        const pages = props.pages;
        const currentPage = props.currentPage;
        const checker = 5;
        let startIndex = 1;
        let endIndex = checker;

        if (checker*2-1 <= pages){
            if (currentPage <= checker){
                startIndex = 1;
                endIndex = checker+(checker-1);
            } else if (currentPage + checker > pages){
                startIndex = pages - ((checker-1)*2);
                endIndex = pages;
            } else if(currentPage > checker && currentPage + checker <= pages){
                startIndex = currentPage+1 - (checker);
                endIndex = currentPage-1 + (checker);
            }
        } else {
            startIndex = 1;
            endIndex = pages;
        }
        

        for (let index = startIndex; index <= endIndex; index++) {
            setPages((list) => [...list, index]);
        }
        return () => {
            setPages([]);
        }
    }, [props.currentPage]);

    const SetList = (value) => {
        props.SetCurrentPage(value);
    }

    const LastPage = () => {
        props.SetCurrentPage(props.pages);
    }

    const FirstPage = () => {
        props.SetCurrentPage(1);
    }

    return (
        <div className="pagination">
            <div className="wrapper">
                <div className="flexing f-n-c">
                    {
                        props.currentPage !== 1?<div className="left f-c-c" onClick={FirstPage}>
                            <FiChevronLeft />
                        </div> : <div className="left-unclickable f-c-c">
                        <FiChevronLeft />
                        </div>
                    }
                    
                    <div className="middle">
                        <ul>
                            {pages.map((item, index) => {
                                return <li onClick={() => SetList(item)} key={index} className={props.currentPage===item?"p-link pagination-active":"p-link"}><span>{item}</span></li>;
                            })}
                        </ul>
                    </div>
                    {
                        props.currentPage < props.pages ?<div className="right f-c-c" onClick={LastPage}>
                            <FiChevronRight />
                        </div> : <div className="right-unclickable f-c-c">
                            <FiChevronRight />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
