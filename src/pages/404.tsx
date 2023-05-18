import { useLocation, useParams, useMatch, useSearchParams } from 'react-router-dom';

export default title('404标题', function Page404(props: any) {
    const [ppp, setpp] = useSearchParams();
    console.log('404', props, ppp.get('id'));
    return <div>404</div>;
});

function title(txt: string, fn: Function) {
    return function () {
        return fn({ title: txt });
    };
}
