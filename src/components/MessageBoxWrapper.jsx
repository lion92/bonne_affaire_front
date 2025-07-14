import { useParams } from 'react-router-dom';
import MessageBox from '../components/MessageBox';

export default function MessageBoxWrapper() {
    const { receiverId } = useParams();

    return <MessageBox receiverId={parseInt(receiverId)} />;
}
