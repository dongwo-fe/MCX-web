import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';

const Home = () => {
    return (
        <div id="home" className="container ">
            home
            <div>
                <Link to={'/main/test'}>跳转test</Link>
            </div>
            <div>
                <Link to={'/beditor'}>新建落地页</Link>
            </div>
        </div>
    );
};
export default Home;
