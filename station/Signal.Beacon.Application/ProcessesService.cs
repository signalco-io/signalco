using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Processes;

namespace Signal.Beacon.Application;

public class ProcessesService : IProcessesService
{
    private readonly IProcessesDao processesDao;

    public ProcessesService(IProcessesDao processesRepository)
    {
        this.processesDao = processesRepository ?? throw new ArgumentNullException(nameof(processesRepository));
    }

    public Task<IEnumerable<Process>> GetAllAsync(CancellationToken cancellationToken) => 
        this.processesDao.GetAllAsync(cancellationToken);
}