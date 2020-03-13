import React, { useState, useEffect } from 'react';
import Post from "./../components/Post";

export default function InfiniteList(props) {

  const [loadMore, setLoadMore] = useState(true);
  const [ page, setPage ] = useState(1);
  useEffect(() => {
    getData(loadMore);
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    const list = document.getElementById('list')
    // if(props.scrollable) {   
    //   // list has fixed height
    //   list.addEventListener('scroll', (e) => {
    //     const el = e.target;
    //     if(el.scrollTop + el.clientHeight === el.scrollHeight) {
    //       setLoadMore(true);
    //     }
    //   });  
    // } else {  
      // list has auto height  

      window.addEventListener('scroll', () => {

        if (window.scrollY + window.innerHeight > list.clientHeight + list.offsetTop) {
            console.log('load');
          setLoadMore(true);
        setPage(page+1); 
        }
      });
    // }
  }, []);

  useEffect(() => {
    const list = document.getElementById('list');

    if(list.clientHeight <= window.innerHeight && list.clientHeight) {
      setLoadMore(true);
    }
  }, [props.state]);


  const getData = (load) => {
    if (load) {
      fetch(`http://localhost:3000/posts?_page=${page}&_limit=3_sort=id&_order=desc`)
        .then(res => {
          return !res.ok 
          ? res.json().then(e => Promise.reject(e)) 
          : res.json();
        })
        .then(res => {
            console.log('reeeees',res);
          props.setState([...props.state, ...res]);
        });
    }
  };

  return (
    <ul id='list'>
      { props.state.map(post => <Post key={post.id} post={post}/>) }
    </ul>
  );
};