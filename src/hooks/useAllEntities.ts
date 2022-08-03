import EntityRepository from 'src/entity/EntityRepository';
import IEntityDetails from 'src/entity/IEntityDetails';
import useLoadingAndError from './useLoadingAndError';

const useAllEntities = () => {
    return useLoadingAndError<IEntityDetails, IEntityDetails>(EntityRepository.allAsync);
};

export default useAllEntities;
