﻿using bd.webapprm.servicios.Interfaces;
using bd.webapprm.servicios.Servicios;
using bd.webapprm.web.Models;
using bd.webapprm.web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace bd.webapprm.web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public async void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {

                options.Cookies.ApplicationCookie.LoginPath = new PathString("/Login/Index");
                options.Cookies.ApplicationCookie.AccessDeniedPath = new PathString("/Login/Index");

                options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromHours(2);

            }).

            AddDefaultTokenProviders();
            // Add framework services.
            services.AddMvc(

            );

            var appSettings = Configuration.GetSection("AppSettings");

            services.AddSingleton<IApiServicio, ApiServicio>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("EstaAutorizado",
                                  policy => policy.Requirements.Add(new RolesRequirement()));
            });

            services.AddSingleton<IAuthorizationHandler, RolesHandler>();
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            var ServicioSeguridad = Configuration.GetSection("ServicioSeguridad").Value;
            var ServiciosLog = Configuration.GetSection("ServiciosLog").Value;
            var ServicioTalentoHumano = Configuration.GetSection("ServiciosTalentoHumano").Value;
            var ServiciosRecursosMateriales = Configuration.GetSection("ServiciosRecursosMateriales").Value;

            var HostSeguridad = Configuration.GetSection("HostServicioSeguridad").Value;

            await InicializarWebApp.InicializarWebTalentoHumano(ServicioTalentoHumano, new Uri(HostSeguridad));
            await InicializarWebApp.InicializarSeguridad(ServicioSeguridad, new Uri(HostSeguridad));
            await InicializarWebApp.InicializarWebRecursosMateriales(ServiciosRecursosMateriales, new Uri(HostSeguridad));
            await InicializarWebApp.InicializarLogEntry(ServiciosLog, new Uri(HostSeguridad));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();




            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();


                using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
                {
                    //serviceScope.ServiceProvider.GetService<LogDbContext>()
                    //         .Database.Migrate();

                   // serviceScope.ServiceProvider.GetService<InicializacionServico>().InicializacionAsync();
                }

            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
