using AutoMapper;

namespace Signal.Core.Extensions;

public static class IMapperExtensions
{
    public static T MapTo<T>(this object obj, IMapper mapper)
    {
        return mapper.Map<T>(obj);
    }
}