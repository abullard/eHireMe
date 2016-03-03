//
//  EHMJobsListViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/22/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMJobsListViewController.h"

#import <AFNetworking.h>
#import "EHMConstants.h"
#import "EHMJobs.h"

@interface EHMJobsListViewController () <UITableViewDataSource, UITableViewDelegate, UISearchBarDelegate>

@property (strong, nonatomic) NSArray *jobsList;
@property (strong, nonatomic) NSMutableArray *searchedJobs;
@property (nonatomic) BOOL isFiltered;

@end

@implementation EHMJobsListViewController

-(void)viewDidLoad {
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    
    self.searchBar.delegate = self;
    
    self.searchedJobs = [[NSMutableArray alloc] init];
    
    [self getAllJobs];
}

#pragma mark - UITableView Delegates and Datasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (self.isFiltered) {
        return [self.searchedJobs count];
    }
    return [self.jobsList count];
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"JobCell" forIndexPath:indexPath];
    
    cell.textLabel.tintColor = [UIColor blackColor];
    if (self.isFiltered) {
        cell.textLabel.text = ((EHMJobs *)[self.searchedJobs objectAtIndex:indexPath.row]).type;
        cell.detailTextLabel.text = ((EHMJobs *)[self.searchedJobs objectAtIndex:indexPath.row]).company;
    } else {
        cell.textLabel.text = ((EHMJobs *)[self.jobsList objectAtIndex:indexPath.row]).type;
        cell.detailTextLabel.text = ((EHMJobs *)[self.jobsList objectAtIndex:indexPath.row]).company;
    }
    
    return cell;
}

#pragma mark - Search Bar Delegates

-(void)searchBar:(UISearchBar *)searchBar textDidChange:(NSString *)searchText
{
    [self.searchedJobs removeAllObjects];
    if ([searchText length] == 0) {
        self.isFiltered = NO;
    } else {
        self.isFiltered = YES;
        
        for (EHMJobs *job in self.jobsList) {
            NSString *company = job.company;
            
            NSRange searchRange = [company rangeOfString:searchText options:NSCaseInsensitiveSearch];
            if (searchRange.location != NSNotFound) {
                [self.searchedJobs addObject:job];
            }
        }
        
    }
    [self.tableView reloadData];
}

-(void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    [self.tableView resignFirstResponder];
    [self.searchBar resignFirstResponder];
}

#pragma mark - Helper Methods

-(void)getAllJobs {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    [manager GET:[NSString stringWithFormat:@"%@/jobs", baseURL] parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        NSMutableArray *jobs = [NSMutableArray array];
        for (NSDictionary *job in responseObject) {
            NSLog(@"%@", job);

            EHMJobs *jobObj = [[EHMJobs alloc] initWithDictionary:job];
            [jobs addObject:jobObj];
        }
        
        self.jobsList = jobs;
        [self.tableView reloadData];
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"Error: %@", error);
    }];

}

@end
