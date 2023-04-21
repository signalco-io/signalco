﻿using Microsoft.Extensions.Hosting;
using Signal.Core;

new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
            .AddCore())
    .Build()
    .Run();
